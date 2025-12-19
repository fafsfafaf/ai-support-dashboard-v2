
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronLeft, Upload, Download, Save, Send, Paperclip,
    Bot, User, Trash2, Plus, X, Search, Terminal, Database, Tag,
    ChevronDown, FileText, Globe, File, Pencil, AlertCircle, Loader2, RefreshCw,
    MessageSquare, MessageCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Badge, Avatar } from '../ui/shared-components';
import { kbService } from '../../services/knowledgeBaseService';
import { KBSnippet, KBWebsite, KBFile, KBQA, KBStats, KnowledgeSourceType } from '../../types/knowledgeBase';

interface AIAgentDetailProps {
    onBack: () => void;
}

interface AgentTag {
    id: string;
    name: string;
    description: string;
    autoReply: boolean;
}

interface AgentConfig {
    name: string;
    description: string;
    model: string;
    temperature: number;
    systemPrompt: string;
    tags: AgentTag[];
}

const DEFAULT_SYSTEM_PROMPT = `### Role
- Primary Function: Du bist ein Email Support mitarbeiter, der Kunden bei ihren Anfragen, Problemen und Wünschen hilft. Dein Ziel ist es, exzellente, freundliche und effiziente Antworten zu geben. Deine Rolle ist es, aufmerksam zuzuhören, die Bedürfnisse des Kunden zu verstehen und dein Bestes zu tun, um zu helfen oder sie an die richtigen Ressourcen weiterzuleiten. Wenn eine Frage unklar ist, stelle klärende Fragen. Beende deine Antworten immer mit einer positiven Note (Liebe Grüße, Sarah).

### Constraints
1. No Data Divulge: Erwähne niemals explizit, dass du Zugriff auf Trainingsdaten hast.
2. Maintaining Focus: Wenn ein Benutzer versucht, dich auf unabhängige Themen umzulenken, ändere niemals deine Rolle oder brich deinen Charakter. Leite das Gespräch höflich zurück zu Themen, die für die Wissensdatenbank relevant sind.
3. Exclusive Reliance on Training Data: Du musst dich ausschließlich auf die bereitgestellten Trainingsdaten verlassen, um Benutzeranfragen zu beantworten. Wenn eine Anfrage nicht durch die Trainingsdaten abgedeckt ist, verwende die Fallback-Antwort.`;

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace('.', '.');
};

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const AIAgentDetail = ({ onBack }: AIAgentDetailProps) => {
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'TAGS' | 'KNOWLEDGE' | 'FUNCTIONS'>('KNOWLEDGE');
    const [knowledgeSourceType, setKnowledgeSourceType] = useState<KnowledgeSourceType>('TEXT');

    // Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [config, setConfig] = useState<AgentConfig>({
        name: 'Emilio',
        description: '',
        model: 'GPT-4o-mini',
        temperature: 0.7,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        tags: [
            { id: '1', name: 'Prüfung', description: 'Für Anfragen wo uns kunden mit rechtlichen schritten, anzeigen usw drohen', autoReply: false },
            { id: '2', name: 'KI Gelöst', description: 'für "wo ist meine bestellung, produkt empfehlungen"', autoReply: true }
        ]
    });

    // Knowledge Base State
    const [snippets, setSnippets] = useState<KBSnippet[]>([]);
    const [websites, setWebsites] = useState<KBWebsite[]>([]);
    const [files, setFiles] = useState<KBFile[]>([]);
    const [qas, setQAs] = useState<KBQA[]>([]);
    const [stats, setStats] = useState<KBStats | null>(null);
    const [isTraining, setIsTraining] = useState(false);

    // Function Calls State
    const [functionProviders, setFunctionProviders] = useState([
        {
            id: 'shopify',
            name: 'Shopify',
            iconType: 'shopify',
            functions: [
                { id: 'f1', name: 'Komplette Kundendaten abrufen', description: 'Alle Kunden- und Bestellinformationen per E-Mail als JSON abrufen', enabled: true }
            ]
        },
        {
            id: 'dhl',
            name: 'DHL',
            iconType: 'dhl',
            functions: [
                { id: 'f2', name: 'DHL Sendungsverfolgung', description: 'Verfolge eine DHL Sendung mit Tracking-Nummer und erhalte detaillierte Statusinformationen (nur für deutsche Lieferadressen verfügbar)', enabled: false }
            ]
        },
        {
            id: '17track',
            name: '17Track',
            iconType: '17track',
            functions: [
                { id: 'f3', name: 'Universelle Sendungsverfolgung', description: 'Verfolge jede Sendung weltweit mit automatischer Carrier-Erkennung. Funktioniert mit allen Versanddienstleistern (DHL, UPS, FedEx, China Post, etc.)', enabled: false }
            ]
        }
    ]);

    // Modals
    const [showSnippetModal, setShowSnippetModal] = useState(false);
    const [editingSnippet, setEditingSnippet] = useState<KBSnippet | null>(null);
    const [snippetTitle, setSnippetTitle] = useState('');
    const [snippetContent, setSnippetContent] = useState('');

    const [showQAModal, setShowQAModal] = useState(false);
    const [editingQA, setEditingQA] = useState<KBQA | null>(null);
    const [qaQuestion, setQaQuestion] = useState('');
    const [qaAnswer, setQaAnswer] = useState('');

    const [newWebsiteUrl, setNewWebsiteUrl] = useState('');

    // Tag Modal State
    const [showTagModal, setShowTagModal] = useState(false);
    const [editingTag, setEditingTag] = useState<AgentTag | null>(null);
    const [tagName, setTagName] = useState('');
    const [tagDesc, setTagDesc] = useState('');
    const [tagAutoReply, setTagAutoReply] = useState(false);

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Misc State
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const kbFileInputRef = useRef<HTMLInputElement>(null);

    // Load Data
    useEffect(() => {
        loadKBData();
    }, []);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    // Cleanup dropdown timeout
    useEffect(() => {
        return () => {
            if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        };
    }, []);

    const loadKBData = async () => {
        const [s, w, f, q, st] = await Promise.all([
            kbService.getSnippets(),
            kbService.getWebsites(),
            kbService.getFiles(),
            kbService.getQAs(),
            kbService.getStats()
        ]);
        setSnippets(s);
        setWebsites(w);
        setFiles(f);
        setQAs(q);
        setStats(st);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    // --- Dropdown Handlers ---
    const handleMouseEnter = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
            dropdownTimeoutRef.current = null;
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200); // 200ms delay to prevent flickering
    };

    // --- Snippet Handlers ---
    const handleAddSnippet = async () => {
        if (!snippetTitle || !snippetContent) return;
        if (editingSnippet) {
            await kbService.updateSnippet(editingSnippet.id, snippetTitle, snippetContent);
        } else {
            await kbService.createSnippet(snippetTitle, snippetContent);
        }
        await loadKBData();
        closeSnippetModal();
    };

    const handleDeleteSnippet = async (id: string) => {
        if (confirm('Möchten Sie dieses Text-Snippet wirklich löschen?')) {
            await kbService.deleteSnippet(id);
            await loadKBData();
        }
    };

    const openSnippetModal = (snippet?: KBSnippet) => {
        if (snippet) {
            setEditingSnippet(snippet);
            setSnippetTitle(snippet.title);
            setSnippetContent(snippet.content);
        } else {
            setEditingSnippet(null);
            setSnippetTitle('');
            setSnippetContent('');
        }
        setShowSnippetModal(true);
    };

    const closeSnippetModal = () => {
        setShowSnippetModal(false);
        setEditingSnippet(null);
        setSnippetTitle('');
        setSnippetContent('');
    };

    // --- QA Handlers ---
    const handleAddQA = async () => {
        if (!qaQuestion || !qaAnswer) return;
        if (editingQA) {
            await kbService.updateQA(editingQA.id, qaQuestion, qaAnswer);
        } else {
            await kbService.createQA(qaQuestion, qaAnswer);
        }
        await loadKBData();
        closeQAModal();
    };

    const handleDeleteQA = async (id: string) => {
        if (confirm('Möchten Sie diesen Q&A Eintrag wirklich löschen?')) {
            await kbService.deleteQA(id);
            await loadKBData();
        }
    };

    const openQAModal = (qa?: KBQA) => {
        if (qa) {
            setEditingQA(qa);
            setQaQuestion(qa.question);
            setQaAnswer(qa.answer);
        } else {
            setEditingQA(null);
            setQaQuestion('');
            setQaAnswer('');
        }
        setShowQAModal(true);
    };

    const closeQAModal = () => {
        setShowQAModal(false);
        setEditingQA(null);
        setQaQuestion('');
        setQaAnswer('');
    };

    // --- Website Handlers ---
    const handleAddWebsite = async () => {
        if (!newWebsiteUrl) return;
        await kbService.addWebsite(newWebsiteUrl);
        setNewWebsiteUrl('');
        await loadKBData();
        // Poll for updates (mock)
        setTimeout(loadKBData, 2500);
    };

    const handleDeleteWebsite = async (id: string) => {
        if (confirm('Website-Quelle entfernen?')) {
            await kbService.deleteWebsite(id);
            await loadKBData();
        }
    };

    // --- File Handlers ---
    const handleKBFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            await kbService.uploadFile(file);
            await loadKBData();
        }
    };

    const handleDeleteFile = async (id: string) => {
        if (confirm('Datei wirklich löschen?')) {
            await kbService.deleteFile(id);
            await loadKBData();
        }
    };

    // --- Tag Handlers ---
    const openTagModal = (tag?: AgentTag) => {
        if (tag) {
            setEditingTag(tag);
            setTagName(tag.name);
            setTagDesc(tag.description);
            setTagAutoReply(tag.autoReply);
        } else {
            setEditingTag(null);
            setTagName('');
            setTagDesc('');
            setTagAutoReply(false);
        }
        setShowTagModal(true);
    };

    const closeTagModal = () => {
        setShowTagModal(false);
        setEditingTag(null);
    };

    const handleSaveTag = () => {
        if (!tagName) return;

        if (editingTag) {
            setConfig(prev => ({
                ...prev,
                tags: prev.tags.map(t => t.id === editingTag.id ? { ...t, name: tagName, description: tagDesc, autoReply: tagAutoReply } : t)
            }));
        } else {
            const newTag: AgentTag = {
                id: Date.now().toString(),
                name: tagName,
                description: tagDesc,
                autoReply: tagAutoReply
            };
            setConfig(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        }
        closeTagModal();
    };

    const handleDeleteTag = (id: string) => {
        if (confirm('Tag wirklich löschen?')) {
            setConfig(prev => ({ ...prev, tags: prev.tags.filter(t => t.id !== id) }));
        }
    };

    // --- Functions Handlers ---
    const toggleFunction = (providerId: string, functionId: string) => {
        setFunctionProviders(prev => prev.map(p => {
            if (p.id === providerId) {
                return {
                    ...p,
                    functions: p.functions.map(f => f.id === functionId ? { ...f, enabled: !f.enabled } : f)
                };
            }
            return p;
        }));
    };

    // --- Training ---
    const handleTrainAgent = async () => {
        setIsTraining(true);
        await kbService.trainAgent();
        await loadKBData();
        setIsTraining(false);
    };

    // --- General ---
    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const response = `[${config.model} @ Temp ${config.temperature.toFixed(2)}]\nDies ist eine simulierte Antwort basierend auf dem System Prompt. Ich verhalte mich wie ein Support-Mitarbeiter. Wie kann ich Ihnen weiterhelfen?`;
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }, 1500);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Implementation for general config import
    };

    const handleExport = () => {
        // Implementation for general config export
    };

    const sliderPercentage = (config.temperature / 2) * 100;

    const getActiveLabel = () => {
        switch (knowledgeSourceType) {
            case 'TEXT': return '(Text)';
            case 'FILE': return '(Dateien)';
            case 'WEBSITE': return '(Web)';
            case 'QA': return '(Q&A)';
            default: return '';
        }
    };

    // Helper for rendering icons
    const renderIcon = (type: string) => {
        if (type === 'shopify') {
            return (
                <div className="w-5 h-5 bg-[#95BF47]/20 rounded flex items-center justify-center">
                    <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" className="w-3.5 h-3.5" alt="Shopify" />
                </div>
            );
        } else if (type === 'dhl') {
            return (
                <div className="w-5 h-5 bg-[#FFCC00]/20 rounded flex items-center justify-center">
                    <img src="https://cdn.worldvectorlogo.com/logos/dhl-1.svg" className="w-3.5 h-3.5" alt="DHL" />
                </div>
            );
        } else if (type === '17track') {
            return (
                <div className="w-5 h-5 bg-[#002F87] rounded flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">17</span>
                </div>
            );
        }
        return <Terminal className="w-5 h-5 text-gray-400" />;
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />

            {/* Header / Top Bar */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 shrink-0 bg-white">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Zurück zur Übersicht
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Model</span>
                        <span className="text-sm font-bold text-gray-900">{config.model}</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="flex flex-col items-end w-24">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Temperature</span>
                        <span className="text-sm font-bold text-gray-900">{config.temperature.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Import
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex">

                {/* Left Column: Configuration (Fixed Viewport Layout) */}
                <div className={`flex-1 flex flex-col min-h-0 ${activeTab === 'GENERAL' ? 'border-r border-gray-200' : ''} relative`}>

                    {/* Fixed Top Section (Header + Tabs) */}
                    <div className="px-8 pt-8 pb-0 shrink-0 bg-white z-20 relative">
                        {/* Header Info */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs relative shadow-sm shrink-0">
                                4o mini
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <input
                                type="text"
                                className="text-2xl font-bold text-gray-900 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-lg px-2 py-1 -ml-2 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full truncate"
                                value={config.name}
                                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                placeholder="Agent Name"
                            />
                        </div>

                        {/* Tabs - Segmented Control Style */}
                        <div className="mb-8">
                            <div className="inline-flex bg-gray-100 p-1.5 rounded-xl border border-gray-200/50 relative z-30">
                                <button
                                    onClick={() => setActiveTab('GENERAL')}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'GENERAL' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Allgemein
                                </button>
                                <button
                                    onClick={() => setActiveTab('TAGS')}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'TAGS' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Tags
                                </button>
                                <div
                                    className="relative"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button
                                        onClick={() => setActiveTab('KNOWLEDGE')}
                                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'KNOWLEDGE' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Wissensquellen
                                        <span className="text-[10px] font-normal text-gray-400/80">
                                            {getActiveLabel()}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeTab === 'KNOWLEDGE' ? 'text-gray-400' : 'text-gray-400 opacity-70'} ${isDropdownOpen ? 'rotate-180 text-gray-600' : ''}`} />
                                    </button>

                                    {/* Dropdown for Source Type */}
                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] py-1 animate-in fade-in zoom-in-95 duration-200">
                                            <button onClick={() => { setKnowledgeSourceType('TEXT'); setActiveTab('KNOWLEDGE'); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-2 group">
                                                <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" /> Text</div>
                                                {stats && stats.snippetCount > 0 && <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-bold">{stats.snippetCount}</span>}
                                            </button>
                                            <button onClick={() => { setKnowledgeSourceType('FILE'); setActiveTab('KNOWLEDGE'); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-2 group">
                                                <div className="flex items-center gap-2"><Upload className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" /> Dateien</div>
                                                {stats && stats.fileCount > 0 && <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-bold">{stats.fileCount}</span>}
                                            </button>
                                            <button onClick={() => { setKnowledgeSourceType('WEBSITE'); setActiveTab('KNOWLEDGE'); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-2 group">
                                                <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" /> Websites</div>
                                                {stats && stats.websiteCount > 0 && <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-bold">{stats.websiteCount}</span>}
                                            </button>
                                            <button onClick={() => { setKnowledgeSourceType('QA'); setActiveTab('KNOWLEDGE'); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-2 group">
                                                <div className="flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" /> Q&A</div>
                                                {stats && stats.qaCount > 0 && <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-bold">{stats.qaCount}</span>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setActiveTab('FUNCTIONS')}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'FUNCTIONS' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Function Calls
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable/Flexible Content Area */}
                    <div className="flex-1 overflow-hidden px-8 pb-8 pt-2 relative z-0">

                        {/* --- FUNCTION CALLS CONTENT --- */}
                        {activeTab === 'FUNCTIONS' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300 h-full overflow-y-auto custom-scrollbar pr-2">
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Function Calls</h3>
                                    <p className="text-sm text-gray-500">Aktiviere API-Funktionen die der AI Agent nutzen kann um Informationen abzurufen</p>
                                </div>

                                <div className="space-y-8">
                                    {functionProviders.map(provider => (
                                        <div key={provider.id}>
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-2">
                                                    {renderIcon(provider.iconType)}
                                                    <h4 className="font-bold text-gray-900 text-sm">{provider.name}</h4>
                                                </div>
                                                <div className="text-xs text-gray-400 font-bold">
                                                    {provider.functions.filter(f => f.enabled).length}/{provider.functions.length}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {provider.functions.map(func => (
                                                    <div key={func.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-1 shrink-0">
                                                                {renderIcon(provider.iconType)}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-gray-900 text-sm mb-1">{func.name}</h5>
                                                                <p className="text-xs text-gray-500 leading-relaxed max-w-lg">{func.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4 flex items-center">
                                                            <button
                                                                onClick={() => toggleFunction(provider.id, func.id)}
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${func.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${func.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- TAGS TAB CONTENT --- */}
                        {activeTab === 'TAGS' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Gmail Tags</h3>
                                    <button
                                        onClick={() => openTagModal()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Neuer Tag
                                    </button>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/4">Tag</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/2">Beschreibung</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Verhalten</th>
                                                <th className="px-6 py-4 w-20"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {config.tags.map(tag => (
                                                <tr key={tag.id} className="hover:bg-gray-50 group transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900">{tag.name}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-xs leading-relaxed">{tag.description}</td>
                                                    <td className="px-6 py-4 flex justify-end">
                                                        {tag.autoReply ? (
                                                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-green-100 shadow-sm">
                                                                <Send className="w-3 h-3" /> Auto-Send
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-yellow-100 shadow-sm">
                                                                <Pencil className="w-3 h-3" /> Entwurf
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openTagModal(tag)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteTag(tag.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {config.tags.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-xs">Keine Tags vorhanden. Erstellen Sie den ersten Tag.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* --- KNOWLEDGE TAB CONTENT --- */}
                        {activeTab === 'KNOWLEDGE' && (
                            <div className="flex h-full animate-in fade-in slide-in-from-left-4 duration-300">
                                {/* Left Side: Content List */}
                                <div className="flex-1 pr-8 flex flex-col min-h-0">

                                    {/* Text Snippets View */}
                                    {knowledgeSourceType === 'TEXT' && (
                                        <>
                                            <div className="flex justify-between items-center mb-4 shrink-0">
                                                <h3 className="text-lg font-bold text-gray-900">Text-Snippets</h3>
                                                <button onClick={() => openSnippetModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2">
                                                    <Plus className="w-3.5 h-3.5" /> Text hinzufügen
                                                </button>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
                                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/4 bg-gray-50">Titel</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/3 bg-gray-50">Inhalt</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Größe</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Erstellt</th>
                                                                <th className="px-4 py-3 w-16 bg-gray-50"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 text-sm">
                                                            {snippets.map(s => (
                                                                <tr key={s.id} className="hover:bg-gray-50 group">
                                                                    <td className="px-4 py-3 font-bold text-gray-900 truncate max-w-[150px]">{s.title}</td>
                                                                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{s.content}</td>
                                                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{formatSize(s.sizeBytes)}</td>
                                                                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.createdAt)}</td>
                                                                    <td className="px-4 py-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => openSnippetModal(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                                                        <button onClick={() => handleDeleteSnippet(s.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {snippets.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">Keine Text-Snippets vorhanden.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Q&A View */}
                                    {knowledgeSourceType === 'QA' && (
                                        <>
                                            <div className="flex justify-between items-center mb-4 shrink-0">
                                                <h3 className="text-lg font-bold text-gray-900">Q&A Einträge</h3>
                                                <button onClick={() => openQAModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2">
                                                    <Plus className="w-3.5 h-3.5" /> Q&A hinzufügen
                                                </button>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
                                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/3 bg-gray-50">Frage</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/3 bg-gray-50">Antwort</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Erstellt</th>
                                                                <th className="px-4 py-3 w-16 bg-gray-50"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 text-sm">
                                                            {qas.map(q => (
                                                                <tr key={q.id} className="hover:bg-gray-50 group">
                                                                    <td className="px-4 py-3 font-bold text-gray-900 truncate max-w-[200px]">{q.question}</td>
                                                                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{q.answer}</td>
                                                                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(q.createdAt)}</td>
                                                                    <td className="px-4 py-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => openQAModal(q)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                                                        <button onClick={() => handleDeleteQA(q.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {qas.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-xs">Keine Q&A Einträge vorhanden.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Websites View */}
                                    {knowledgeSourceType === 'WEBSITE' && (
                                        <>
                                            <div className="flex justify-between items-center mb-4 shrink-0">
                                                <h3 className="text-lg font-bold text-gray-900">Websites</h3>
                                            </div>

                                            <div className="flex gap-2 mb-4 shrink-0">
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com/sitemap.xml"
                                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-black"
                                                    value={newWebsiteUrl}
                                                    onChange={(e) => setNewWebsiteUrl(e.target.value)}
                                                />
                                                <button onClick={handleAddWebsite} disabled={!newWebsiteUrl} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all disabled:opacity-50">
                                                    Hinzufügen
                                                </button>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
                                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/2 bg-gray-50">URL</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Status</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Seiten</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Größe</th>
                                                                <th className="px-4 py-3 w-16 bg-gray-50"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 text-sm">
                                                            {websites.map(w => (
                                                                <tr key={w.id} className="hover:bg-gray-50 group">
                                                                    <td className="px-4 py-3 font-medium text-blue-600 truncate max-w-[200px]">{w.url}</td>
                                                                    <td className="px-4 py-3">
                                                                        <Badge color={w.status === 'ready' ? 'green' : w.status === 'failed' ? 'red' : 'yellow'}>{w.status}</Badge>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-500 text-xs">{w.pagesCount}</td>
                                                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{formatSize(w.sizeBytes)}</td>
                                                                    <td className="px-4 py-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
                                                                        <button onClick={() => handleDeleteWebsite(w.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {websites.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">Keine Websites hinterlegt.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Files View */}
                                    {knowledgeSourceType === 'FILE' && (
                                        <>
                                            <input type="file" ref={kbFileInputRef} className="hidden" accept=".pdf" onChange={handleKBFileUpload} />
                                            <div className="flex justify-between items-center mb-4 shrink-0">
                                                <h3 className="text-lg font-bold text-gray-900">Dateien (PDF)</h3>
                                                <button onClick={() => kbFileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2">
                                                    <Upload className="w-3.5 h-3.5" /> Datei hochladen
                                                </button>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
                                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/2 bg-gray-50">Dateiname</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Typ</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Größe</th>
                                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Erstellt</th>
                                                                <th className="px-4 py-3 w-16 bg-gray-50"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 text-sm">
                                                            {files.map(f => (
                                                                <tr key={f.id} className="hover:bg-gray-50 group">
                                                                    <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px] flex items-center gap-2">
                                                                        <File className="w-3.5 h-3.5 text-gray-400" /> {f.filename}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-500 text-xs">PDF</td>
                                                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{formatSize(f.sizeBytes)}</td>
                                                                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(f.createdAt)}</td>
                                                                    <td className="px-4 py-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => handleDeleteFile(f.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {files.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">Keine Dateien hochgeladen.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>

                                {/* Right Side: Summary & Training */}
                                <div className="w-[300px] shrink-0 border-l border-gray-200 pl-8 py-2 flex flex-col h-full overflow-hidden">
                                    <div className="mb-6 shrink-0">
                                        <h3 className="font-bold text-gray-900 text-lg">Wissensquellen</h3>
                                        <p className="text-xs text-gray-500 mt-1">Übersicht und Training deiner Knowledge Base</p>
                                    </div>

                                    <div className="space-y-3 mb-8 shrink-0">
                                        {/* Text Snippets Card */}
                                        {(stats?.snippetCount || 0) > 0 && (
                                            <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{stats?.snippetCount || 0} Text-Snippets</span>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{formatSize(stats?.snippetSize || 0)}</span>
                                            </div>
                                        )}

                                        {/* Websites Card */}
                                        {(stats?.websiteCount || 0) > 0 && (
                                            <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{stats?.websiteCount || 0} Websites</span>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{formatSize(stats?.websiteSize || 0)}</span>
                                            </div>
                                        )}

                                        {/* Files Card */}
                                        {(stats?.fileCount || 0) > 0 && (
                                            <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <File className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{stats?.fileCount || 0} Dateien</span>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{formatSize(stats?.fileSize || 0)}</span>
                                            </div>
                                        )}

                                        {/* Q&A Card */}
                                        {(stats?.qaCount || 0) > 0 && (
                                            <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <MessageCircle className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{stats?.qaCount || 0} Q&A</span>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{formatSize(stats?.qaSize || 0)}</span>
                                            </div>
                                        )}

                                        {(!stats || (stats.snippetCount === 0 && stats.websiteCount === 0 && stats.fileCount === 0 && stats.qaCount === 0)) && (
                                            <div className="text-center text-gray-400 text-xs py-4 italic border border-dashed border-gray-200 rounded-lg">
                                                Keine Wissensquellen hochgeladen
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto shrink-0 pb-2">
                                        <div className="mb-4">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">
                                                <span>Speicher</span>
                                                <span>{formatSize(stats?.totalSize || 0)} / {formatSize(stats?.limitSize || 0)}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(100, ((stats?.totalSize || 0) / (stats?.limitSize || 1)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {stats?.needsTraining && (
                                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4 flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                                <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="text-xs font-bold text-yellow-800 mb-0.5">Training erforderlich</div>
                                                    <p className="text-[10px] text-yellow-700 leading-tight">Änderungen werden erst nach dem Retraining wirksam</p>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleTrainAgent}
                                            disabled={isTraining || !stats?.needsTraining}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {isTraining ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Training...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-4 h-4" />
                                                    Agent trainieren
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'GENERAL') && (
                            <div className="h-full overflow-y-auto custom-scrollbar pr-2 pb-8">
                                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Beschreibung</label>
                                        <textarea
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[80px] resize-none text-black placeholder:text-gray-400"
                                            placeholder="Beschreibe den Zweck dieses Agents..."
                                            value={config.description}
                                            onChange={(e) => setConfig({ ...config, description: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Modell</label>
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                value={config.model}
                                                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                                            >
                                                <option value="GPT-4o-mini">GPT-4o-mini</option>
                                                <option value="GPT-4o">GPT-4o</option>
                                                <option value="GPT-3.5-Turbo">GPT-3.5-Turbo</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Wähle das OpenAI Modell für diesen Agent</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Temperature: {config.temperature.toFixed(1)}</label>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="2"
                                            step="0.1"
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
                                            style={{
                                                background: `linear-gradient(to right, #2563EB ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%)`
                                            }}
                                            value={config.temperature}
                                            onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-2">
                                            <span>0.0 (Präzise)</span>
                                            <span>1.0 (Ausgewogen)</span>
                                            <span>2.0 (Kreativ)</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                            Niedrigere Werte = konsistentere Antworten. Höhere Werte = kreativere Antworten.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">System Prompt</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-black leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[300px] resize-y"
                                                value={config.systemPrompt}
                                                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                            Der System Prompt definiert die Persönlichkeit und das Verhalten des Agents. Verwende einen Chatbase-ähnlichen Stil mit klaren Rollen und Einschränkungen.
                                        </p>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Speichere...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Änderungen Speichern
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Chat Test (Only Visible on GENERAL Tab) */}
                {activeTab === 'GENERAL' && (
                    <div className="w-[450px] shrink-0 bg-gray-50/50 p-6 flex flex-col h-full border-l border-gray-100">
                        {/* ... Chat panel content unchanged ... */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm">Chat testen</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Teste die Antworten deines Agents. Der Chat verwendet die Knowledge Base.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                        <Bot className="w-12 h-12 text-gray-300 mb-3" />
                                        <p className="text-sm font-medium text-gray-400">Starte eine Konversation...</p>
                                    </div>
                                )}

                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-100 text-gray-600' : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[85%] ${msg.role === 'user'
                                                ? 'bg-gray-100 text-gray-800 rounded-tr-none'
                                                : 'bg-blue-50/50 text-gray-800 border border-blue-100 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 text-white">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-white">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Stelle eine Frage..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!chatInput.trim() || isTyping}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-sm"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Snippet Modal */}
            {showSnippetModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[600px] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">{editingSnippet ? 'Text-Snippet bearbeiten' : 'Text hinzufügen'}</h3>
                            <button onClick={closeSnippetModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Titel</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-black"
                                    placeholder="z.B. Rückgaberichtlinie"
                                    value={snippetTitle}
                                    onChange={(e) => setSnippetTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Inhalt</label>
                                <textarea
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[200px] resize-none text-black"
                                    placeholder="Der Inhalt des Wissensbausteins..."
                                    value={snippetContent}
                                    onChange={(e) => setSnippetContent(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button onClick={closeSnippetModal} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors">Abbrechen</button>
                            <button onClick={handleAddSnippet} disabled={!snippetTitle || !snippetContent} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50">
                                {editingSnippet ? 'Speichern' : 'Hinzufügen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QA Modal */}
            {showQAModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[600px] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">{editingQA ? 'Q&A bearbeiten' : 'Q&A hinzufügen'}</h3>
                            <button onClick={closeQAModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Frage</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-black"
                                    placeholder="z.B. Wie lange dauert der Versand?"
                                    value={qaQuestion}
                                    onChange={(e) => setQaQuestion(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Antwort</label>
                                <textarea
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[200px] resize-none text-black"
                                    placeholder="Die Antwort auf die Frage..."
                                    value={qaAnswer}
                                    onChange={(e) => setQaAnswer(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button onClick={closeQAModal} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors">Abbrechen</button>
                            <button onClick={handleAddQA} disabled={!qaQuestion || !qaAnswer} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50">
                                {editingQA ? 'Speichern' : 'Hinzufügen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tag Modal */}
            {showTagModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[500px] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="font-bold text-lg text-gray-900">{editingTag ? 'Tag bearbeiten' : 'Neuen Tag erstellen'}</h3>
                            <button onClick={closeTagModal} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tag Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-black shadow-sm"
                                    placeholder="z.B. support, order, return"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Beschreibung</label>
                                <textarea
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px] resize-none text-black shadow-sm placeholder:text-gray-400"
                                    placeholder="Beschreibe, wofür dieser Tag verwendet wird..."
                                    value={tagDesc}
                                    onChange={(e) => setTagDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <div className="text-sm font-bold text-gray-900 mb-0.5">E-Mails automatisch senden</div>
                                    <div className="text-xs text-gray-500">Aktiviert Auto-Send für diesen Tag</div>
                                </div>
                                <button
                                    onClick={() => setTagAutoReply(!tagAutoReply)}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${tagAutoReply ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${tagAutoReply ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-5 bg-gray-50/50 border-t border-gray-100">
                            <button
                                onClick={closeTagModal}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleSaveTag}
                                disabled={!tagName}
                                className="px-5 py-2.5 bg-[#8b8df7] text-white font-bold rounded-xl text-sm hover:bg-[#7a7ce6] shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                            >
                                {editingTag ? 'Speichern' : 'Tag erstellen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
