
import React from 'react';
import { Ticket } from '@/types';
import { MessageBubble } from './message-bubble';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Paperclip, Smile, Bold, Italic, Underline, Link, ChevronDown, Reply, StickyNote, FileText, Send, Languages } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConversationThreadProps {
    ticket: Ticket;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({ ticket }) => {
    return (
        <Card className="flex flex-col h-full overflow-hidden bg-white shadow-sm border border-gray-200/60">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div>
                    <h2 className="font-semibold text-gray-900 text-lg mb-0.5">{ticket.subject}</h2>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>via {ticket.channel}</span>
                        <span>•</span>
                        <span>Ticket #{ticket.id}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">Resolve</Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal size={18} /></Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white/40">
                {ticket.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>

            {/* Composer - Recruitee Style */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden transition-all focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/40">

                    {/* Composer Header: To/From */}
                    <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">An</span>
                            <span className="font-medium text-gray-700">{ticket.customerId === 'c1' ? 'rechnung@erkanadali.de' : 'customer@example.com'}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-400">Von</span>
                            <div className="flex items-center gap-1 font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                                <span className="text-blue-600 font-bold">M</span>
                                <span>erkan.ecomm@gmail.com</span>
                                <ChevronDown size={12} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="cursor-pointer hover:text-gray-700">Cc</span>
                            <span className="cursor-pointer hover:text-gray-700">Bcc</span>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="border-b border-gray-100 px-2 py-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700 rounded"><Bold size={14} /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700 rounded"><Italic size={14} /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700 rounded"><Underline size={14} /></Button>
                            <div className="w-px h-4 bg-gray-200 mx-1" />
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700 rounded"><Link size={14} /></Button>
                        </div>

                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                            <button className="flex items-center gap-1.5 px-3 py-1 bg-white text-gray-900 shadow-sm rounded-md text-xs font-medium border border-gray-200/50">
                                <Reply size={12} /> Antwort
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1 text-gray-500 hover:text-gray-900 rounded-md text-xs font-medium transition-colors">
                                <StickyNote size={12} /> Notiz
                            </button>
                        </div>
                    </div>

                    {/* Textarea */}
                    <div className="relative">
                        <textarea
                            className="w-full p-4 min-h-[140px] outline-none text-sm resize-none placeholder:text-gray-400"
                            placeholder="Schreiben Sie eine Antwort..."
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="px-3 py-2.5 flex justify-between items-center border-t border-gray-50 bg-gray-50/10">
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200"><FileText size={16} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200"><Paperclip size={16} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200"><Smile size={16} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200"><Languages size={16} /></Button>
                        </div>
                        <div className="flex items-center gap-0">
                            <Button variant="primary" className="rounded-r-none px-6 shadow-sm shadow-primary/20">
                                <Send size={14} className="mr-2" /> Senden
                            </Button>
                            <Button variant="primary" className="rounded-l-none border-l border-white/20 px-2 shadow-sm shadow-primary/20">
                                <ChevronDown size={14} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
