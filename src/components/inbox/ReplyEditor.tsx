
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Bold, Italic, Underline, Link as LinkIcon, Send, EyeOff, File as FileIcon, X, FileText as TemplateIcon, Paperclip, Smile, Languages, Loader2, Command, CornerDownLeft, Check, Plus, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { EMOJIS, TEMPLATES } from '@/lib/data';
import { LinkModal, ConnectGmailModal, ConfirmationModal } from './InboxModals';
import { TextMorph } from '@/components/ui/text-morph';

const SUPPORTED_LANGUAGES = [
    { code: 'DE', name: 'Deutsch', flagUrl: 'https://em-content.zobj.net/source/apple/391/flag-germany_1f1e9-1f1ea.png' },
    { code: 'US', name: 'Englisch', flagUrl: 'https://em-content.zobj.net/source/apple/391/flag-united-states_1f1fa-1f1f8.png' },
    { code: 'FR', name: 'Französisch', flagUrl: 'https://em-content.zobj.net/source/apple/391/flag-france_1f1eb-1f1f7.png' },
    { code: 'ES', name: 'Spanisch', flagUrl: 'https://em-content.zobj.net/source/apple/391/flag-spain_1f1ea-1f1f8.png' },
    { code: 'TR', name: 'Türkisch', flagUrl: 'https://em-content.zobj.net/source/apple/391/flag-turkey_1f1f9-1f1f7.png' },
    { code: 'PL', name: 'Polnisch', flagUrl: 'https://em-content.zobj.net/source/apple/391/flag-poland_1f1f5-1f1f1.png' },
];

// Shared Animation Variants for all Footer Popups
const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] as any }
    },
    exit: {
        opacity: 0,
        y: 8,
        scale: 0.97,
        filter: 'blur(2px)',
        transition: { duration: 0.15, ease: 'easeIn' }
    }
};

interface ReplyEditorProps {
    onSend: (content: string, mode: 'REPLY' | 'NOTE', attachments: File[], cc?: string, bcc?: string) => void;
    customerEmail?: string;
    initialContent?: string;
}

const ReplyEditor = ({ onSend, customerEmail, initialContent = '' }: ReplyEditorProps) => {
    const [mode, setMode] = useState<'REPLY' | 'NOTE'>('REPLY');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showConnectGmailModal, setShowConnectGmailModal] = useState(false);

    // Translation State
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationStatusText, setTranslationStatusText] = useState('');

    const [attachments, setAttachments] = useState<File[]>([]);
    const [hasContent, setHasContent] = useState(false);
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');

    // Sender selection state
    const [showSenderMenu, setShowSenderMenu] = useState(false);
    const [connectedAccounts, setConnectedAccounts] = useState([
        { email: 'erkan.ecomm@gmail.com', provider: 'GMAIL' }
    ]);
    const [selectedAccount, setSelectedAccount] = useState(connectedAccounts[0]);

    // Account removal confirmation
    const [showRemoveAccountConfirm, setShowRemoveAccountConfirm] = useState(false);
    const [accountToRemove, setAccountToRemove] = useState<string | null>(null);

    const senderMenuRef = useRef<HTMLDivElement>(null);

    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const savedSelectionRange = useRef<Range | null>(null);
    const [formats, setFormats] = useState({ bold: false, italic: false, underline: false });

    // Update editor content when initialContent changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = initialContent;
            setFormats({ bold: false, italic: false, underline: false });
            setAttachments([]);
            const text = editorRef.current.innerText.trim();
            setHasContent(text.length > 0);
        }
    }, [initialContent]);

    useEffect(() => { updateEditorState(); }, [attachments]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (senderMenuRef.current && !senderMenuRef.current.contains(target)) {
                setShowSenderMenu(false);
            }
            // Close other pickers on outside click
            if (!target.closest('.editor-footer-button')) {
                setShowTemplates(false);
                setShowEmojiPicker(false);
                setShowTranslateDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateEditorState = () => {
        if (editorRef.current) {
            const text = editorRef.current.innerText.trim();
            setHasContent(text.length > 0 || attachments.length > 0);
            if (document.activeElement === editorRef.current) {
                setFormats({
                    bold: document.queryCommandState('bold'),
                    italic: document.queryCommandState('italic'),
                    underline: document.queryCommandState('underline')
                });
            }
        }
    };
    const execCmd = (command: string, value: string | undefined = undefined) => {
        if (editorRef.current && document.activeElement !== editorRef.current) { editorRef.current.focus(); }
        document.execCommand(command, false, value);
        updateEditorState();
    };

    const handleLinkClick = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedSelectionRange.current = selection.getRangeAt(0);
        } else {
            savedSelectionRange.current = null;
        }
        setShowLinkModal(true);
    };

    const handleInsertLink = (url: string, title: string, target: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
            if (savedSelectionRange.current) {
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(savedSelectionRange.current);
                }
            }
            const linkHtml = `<a href="${url}" target="${target}" class="text-blue-600 underline">${title || url}</a>`;
            document.execCommand('insertHTML', false, linkHtml);
            updateEditorState();
        }
    };

    const handleEmojiClick = (emoji: string) => { execCmd('insertText', emoji); setShowEmojiPicker(false); updateEditorState(); };
    const handleTemplateClick = (content: string) => {
        if (editorRef.current) { editorRef.current.focus(); editorRef.current.innerHTML = content; setShowTemplates(false); updateEditorState(); }
    };
    const handleFileClick = () => { fileInputRef.current?.click(); };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) { setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]); }
    };
    const removeAttachment = (index: number) => { setAttachments(prev => prev.filter((_, i) => i !== index)); };

    const handleTranslate = async (lang: typeof SUPPORTED_LANGUAGES[0]) => {
        setShowTranslateDropdown(false);
        if (!editorRef.current) return;
        const currentText = editorRef.current.innerText.trim();
        if (!currentText) return;
        setTranslationStatusText(currentText);
        setIsTranslating(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        let translatedText = "";
        if (lang.code === 'US') translatedText = "Hello, thank you for your message. We are checking your request regarding the order and will get back to you shortly.";
        else if (lang.code === 'FR') translatedText = "Bonjour, merci pour votre message. Nous examinons votre demande concernant la commande et reviendrons vers vous sous peu.";
        else if (lang.code === 'DE') translatedText = "Hallo, danke für Ihre Nachricht. Wir prüfen Ihr Anliegen bezüglich der Bestellung und melden uns in Kürze bei Ihnen.";
        else if (lang.code === 'ES') translatedText = "Hola, gracias por su mensaje. Estamos revisando su solicitud sobre el pedido y nos pondremos in contacto con usted en breve.";
        else if (lang.code === 'TR') translatedText = "Merhaba, mesajınız für teşekkürler. Siparişle ilgili isteğinizi inceliyoruz ve kısa süre içinde size döneceğiz.";
        else if (lang.code === 'PL') translatedText = "Cześć, dziękujemy za wiadomość. Sprawdzamy Twoje zgłoszenie dotyczące zamówienia i wkrótce się odezwiemy.";
        else translatedText = currentText + " [Translated]";
        setTranslationStatusText(translatedText);
        await new Promise(resolve => setTimeout(resolve, 1800));
        if (editorRef.current) { editorRef.current.innerText = translatedText; }
        setIsTranslating(false);
        setTimeout(() => {
            updateEditorState();
            if (editorRef.current) {
                editorRef.current.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
        }, 50);
    };

    const handleSendClick = () => {
        if (!editorRef.current) return;
        const content = editorRef.current.innerHTML;
        if (!hasContent) return;
        onSend(content, mode, attachments, cc, bcc);
        editorRef.current.innerHTML = '';
        setAttachments([]);
        setHasContent(false);
        setFormats({ bold: false, italic: false, underline: false });
        setCc('');
        setBcc('');
        setShowCc(false);
        setShowBcc(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSendClick();
            return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    const handleConnectAccount = () => {
        setShowConnectGmailModal(true);
        setShowSenderMenu(false);
    };

    const handleGmailConnect = (email: string) => {
        const newAccount = { email, provider: 'GMAIL' };
        setConnectedAccounts([...connectedAccounts, newAccount]);
        setSelectedAccount(newAccount);
    };

    const initiateRemoveAccount = (email: string) => {
        setAccountToRemove(email);
        setShowRemoveAccountConfirm(true);
        setShowSenderMenu(false);
    };

    const executeRemoveAccount = () => {
        if (!accountToRemove) return;
        const newAccounts = connectedAccounts.filter(acc => acc.email !== accountToRemove);
        setConnectedAccounts(newAccounts);
        if (selectedAccount.email === accountToRemove) {
            if (newAccounts.length > 0) { setSelectedAccount(newAccounts[0]); }
            else { setSelectedAccount({ email: 'Kein Absender', provider: 'NONE' }); }
        }
        setAccountToRemove(null);
        setShowRemoveAccountConfirm(false);
    };

    // Determine if a modal is open to raise z-index above everything else (Sidebar, Headers, etc.)
    const isAnyModalOpen = showLinkModal || showConnectGmailModal || showRemoveAccountConfirm;

    return (
        <div className={`border rounded-xl bg-white shadow-sm overflow-visible flex flex-col relative transition-colors ${isAnyModalOpen ? 'z-[9999]' : 'z-20'} ${mode === 'NOTE' ? 'border-yellow-300' : 'border-gray-200'}`}>

            <LinkModal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} onInsert={handleInsertLink} />
            <ConnectGmailModal isOpen={showConnectGmailModal} onClose={() => setShowConnectGmailModal(false)} onConnect={handleGmailConnect} />

            <ConfirmationModal
                isOpen={showRemoveAccountConfirm}
                onClose={() => setShowRemoveAccountConfirm(false)}
                onConfirm={executeRemoveAccount}
                title="Konto entfernen?"
                message={`Möchten Sie das Konto ${accountToRemove} wirklich entfernen?`}
                confirmLabel="Entfernen"
                isDestructive={true}
            />

            <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            <div className={`px-4 py-3 border-b rounded-t-xl ${mode === 'NOTE' ? 'bg-yellow-50 border-yellow-100' : 'bg-[#F9FAFB] border-gray-200'}`}>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 flex-wrap">
                            <span>An</span>
                            <span className="text-gray-700 font-medium px-2 py-0.5">{customerEmail || 'Kein Empfänger'}</span>
                            <span className="text-gray-400 mx-1">•</span>
                            <span>Von</span>

                            <div className="relative" ref={senderMenuRef}>
                                <button
                                    onClick={() => setShowSenderMenu(!showSenderMenu)}
                                    className="flex items-center gap-1.5 text-gray-700 hover:bg-gray-200/50 px-2 py-0.5 rounded cursor-pointer transition-colors max-w-[220px]"
                                >
                                    {selectedAccount.provider === 'GMAIL' && <img src="https://cdn.icon-icons.com/icons2/2631/PNG/512/gmail_new_logo_icon_159149.png" className="w-3.5 h-3.5 shrink-0" alt="gmail" />}
                                    <span className="font-medium truncate">{selectedAccount.email}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                </button>

                                <AnimatePresence>
                                    {showSenderMenu && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={dropdownVariants}
                                            className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 flex flex-col"
                                        >
                                            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-50">Absender wählen</div>
                                            <div className="py-1">
                                                {connectedAccounts.map(account => (
                                                    <div key={account.email} className="group flex items-center justify-between w-full hover:bg-gray-50 pr-2 transition-colors">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedAccount(account); setShowSenderMenu(false); }}
                                                            className="px-3 py-2 text-left text-xs flex items-center gap-3 text-gray-700 font-medium flex-1 min-w-0"
                                                        >
                                                            {account.provider === 'GMAIL' && <img src="https://cdn.icon-icons.com/icons2/2631/PNG/512/gmail_new_logo_icon_159149.png" className="w-4 h-4 opacity-80 group-hover:opacity-100 shrink-0" alt="gmail" />}
                                                            <span className="truncate">{account.email}</span>
                                                            {selectedAccount.email === account.email && <Check className="ml-2 w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); initiateRemoveAccount(account.email); }}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                                            title="Konto entfernen"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {connectedAccounts.length === 0 && (
                                                    <div className="px-3 py-4 text-center text-xs text-gray-500 italic">Keine Konten verbunden</div>
                                                )}
                                            </div>
                                            <div className="border-t border-gray-100 mt-1 pt-1 p-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleConnectAccount(); }}
                                                    className="w-full flex items-center gap-2 px-2 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Anderes Gmail Konto verbinden
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500 font-medium">
                            <span onClick={() => setShowCc(!showCc)} className={`cursor-pointer hover:text-gray-800 ${showCc ? 'text-indigo-600 font-bold' : ''}`}>Cc</span>
                            <span onClick={() => setShowBcc(!showBcc)} className={`cursor-pointer hover:text-gray-800 ${showBcc ? 'text-indigo-600 font-bold' : ''}`}>Bcc</span>
                        </div>
                    </div>
                    {showCc && (<div className="flex items-center gap-2 text-sm animate-in slide-in-from-top-2 duration-200"><span className="text-gray-500 w-8">Cc:</span><input type="text" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="Cc Empfänger..." className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400" /></div>)}
                    {showBcc && (<div className="flex items-center gap-2 text-sm animate-in slide-in-from-top-2 duration-200"><span className="text-gray-500 w-8">Bcc:</span><input type="text" value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="Bcc Empfänger..." className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400" /></div>)}
                </div>
            </div>
            <div className={`flex items-center justify-between px-3 py-2 border-b bg-white ${mode === 'NOTE' ? 'border-yellow-100' : 'border-gray-100'}`}>
                <div className="flex items-center gap-1">
                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} className={`p-1.5 rounded transition-colors ${formats.bold ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`} title="Fett"><Bold className="h-4 w-4" /></button>
                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} className={`p-1.5 rounded transition-colors ${formats.italic ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`} title="Kursiv"><Italic className="h-4 w-4" /></button>
                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }} className={`p-1.5 rounded transition-colors ${formats.underline ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`} title="Unterstrichen"><Underline className="h-4 w-4" /></button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button onMouseDown={(e) => { e.preventDefault(); handleLinkClick(); }} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded hover:text-gray-900 transition-colors" title="Link einfügen"><LinkIcon className="h-4 w-4" /></button>
                </div>
                <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <button onClick={() => setMode('REPLY')} className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${mode === 'REPLY' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Send className="h-3 w-3" /> Antwort</button>
                    <button onClick={() => setMode('NOTE')} className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${mode === 'NOTE' ? 'bg-yellow-100 text-yellow-800 shadow-sm border border-yellow-200' : 'text-gray-500 hover:text-gray-700'}`}><EyeOff className="h-3 w-3" /> Notiz</button>
                </div>
            </div>
            {attachments.length > 0 && (<div className="px-4 pt-3 flex flex-wrap gap-2 bg-white">{attachments.map((file, i) => (<div key={i} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 animate-in fade-in zoom-in-95 duration-200"><FileIcon className="h-3.5 w-3.5 text-gray-500" /><span className="max-w-[150px] truncate">{file.name}</span><button onClick={() => removeAttachment(i)} className="hover:text-red-600 ml-1"><X className="h-3 w-3" /></button></div>))}</div>)}

            <div className={`w-full h-full relative min-h-[100px] overflow-hidden ${mode === 'NOTE' ? 'bg-yellow-50/30' : 'bg-white'}`}>
                {isTranslating && (
                    <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-[1px] p-4">
                        <TextMorph text={translationStatusText} className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-indigo-700 drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={updateEditorState}
                    onMouseUp={updateEditorState}
                    onKeyUp={updateEditorState}
                    onClick={updateEditorState}
                    onKeyDown={handleKeyDown}
                    className={`w-full h-full p-4 focus:outline-none text-sm leading-relaxed text-gray-900 empty:before:content-[attr(placeholder)] empty:before:text-gray-400 cursor-text overflow-y-auto max-h-[300px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline transition-opacity duration-300 ${isTranslating ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    role="textbox"
                    tabIndex={0}
                    aria-placeholder={mode === 'REPLY' ? "Schreiben Sie eine Antwort..." : "Interne Notiz hinzufügen (nur für das Team sichtbar)..."}
                    style={{ whiteSpace: 'pre-wrap' }}
                ></div>
            </div>

            <div className={`px-3 py-2 flex items-center justify-between border-t rounded-b-xl relative ${mode === 'NOTE' ? 'bg-yellow-50 border-yellow-100' : 'bg-white border-gray-100'}`}>
                <div className="flex gap-1 relative">
                    {/* TEMPLATES DROPDOWN */}
                    <div className="relative editor-footer-button">
                        <button onClick={() => { setShowTemplates(!showTemplates); setShowEmojiPicker(false); setShowTranslateDropdown(false); }} className={`p-2 rounded-lg border transition-colors ${showTemplates ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 border-gray-200 hover:border-gray-300'}`}><TemplateIcon className="h-4 w-4" /></button>
                        <AnimatePresence>
                            {showTemplates && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={dropdownVariants}
                                    className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 shadow-xl rounded-xl w-64 overflow-hidden z-50 flex flex-col p-1 origin-bottom-left"
                                >
                                    <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Vorlagen</div>
                                    {TEMPLATES.map((tmpl, idx) => (
                                        <button key={idx} onClick={() => handleTemplateClick(tmpl.content)} className="px-3 py-2 text-left text-xs font-medium hover:bg-gray-50 rounded-lg text-gray-700 flex flex-col gap-0.5">
                                            <span className="font-bold text-gray-900">{tmpl.title}</span>
                                            <span className="text-gray-400 truncate w-full">{tmpl.content.replace(/<br>/g, ' ').substring(0, 40)}...</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button onClick={handleFileClick} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"><Paperclip className="h-4 w-4" /></button>

                    {/* EMOJI PICKER DROPDOWN */}
                    <div className="relative editor-footer-button">
                        <button onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowTemplates(false); setShowTranslateDropdown(false); }} className={`p-2 rounded-lg border transition-colors ${showEmojiPicker ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 border-gray-200 hover:border-gray-300'}`}><Smile className="h-4 w-4" /></button>
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={dropdownVariants}
                                    className="absolute bottom-full left-0 mb-2 p-3 bg-white border border-gray-200 shadow-xl rounded-xl w-64 grid grid-cols-6 gap-2 z-50 origin-bottom-left"
                                >
                                    {EMOJIS.map(emoji => (
                                        <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-xl hover:bg-gray-100 p-1.5 rounded-lg transition-colors flex items-center justify-center">{emoji}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* TRANSLATE DROPDOWN */}
                    <div className="relative editor-footer-button">
                        <button
                            onClick={() => { setShowTranslateDropdown(!showTranslateDropdown); setShowTemplates(false); setShowEmojiPicker(false); }}
                            className={`p-2 rounded-lg border transition-colors ${showTranslateDropdown ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 border-gray-200 hover:border-gray-300'}`}
                        >
                            <Languages className="h-4 w-4" />
                        </button>
                        <AnimatePresence>
                            {showTranslateDropdown && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={dropdownVariants}
                                    className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 shadow-xl rounded-xl w-48 overflow-hidden z-50 flex flex-col p-1 origin-bottom-left"
                                >
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-50 mb-1">ÜBERSETZEN IN</div>
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleTranslate(lang)}
                                                className="w-full px-3 py-2 text-left text-xs font-medium hover:bg-gray-50 rounded-lg text-gray-700 flex items-center gap-3 transition-colors group"
                                            >
                                                <img src={lang.flagUrl} alt={lang.name} className="w-5 h-auto rounded-[2px] object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSendClick} disabled={!hasContent} className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all ${hasContent ? (mode === 'NOTE' ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md active:scale-95 cursor-pointer' : 'bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95 cursor-pointer') : 'bg-blue-200 cursor-not-allowed'}`}>{mode === 'NOTE' ? <EyeOff className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}{mode === 'NOTE' ? 'Notiz hinzufügen' : 'Senden'}<div className="flex items-center gap-0.5 ml-1 bg-white/20 rounded px-1 py-0.5"><Command className="h-3 w-3" /><CornerDownLeft className="h-3 w-3" /></div></button>
                </div>
            </div>
        </div>
    );
};

export default ReplyEditor;
