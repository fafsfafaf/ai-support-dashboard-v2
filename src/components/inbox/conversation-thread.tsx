
import React from 'react';
import { Ticket } from '@/types';
import { MessageBubble } from './message-bubble';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, AtSign, Paperclip, Smile } from 'lucide-react';
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

            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <div className="mb-3 flex justify-between items-center">
                    <TabsList className="bg-white border border-gray-200 h-8">
                        <TabsTrigger active>Reply</TabsTrigger>
                        <TabsTrigger>Note</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><AtSign size={16} /></Button>
                    </div>
                </div>

                <div className="bg-white border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-xl overflow-hidden transition-all shadow-sm">
                    <textarea
                        className="w-full p-4 min-h-[100px] outline-none text-sm resize-none placeholder:text-gray-400"
                        placeholder="Write a reply..."
                    />
                    <div className="px-3 py-2 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><Paperclip size={16} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><Smile size={16} /></Button>
                        </div>
                        <Button variant="primary">Send</Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
