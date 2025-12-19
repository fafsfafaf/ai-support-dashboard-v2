
import React from 'react';
import { Ticket } from '@/types';
import { MessageBubble } from './message-bubble';

interface ConversationThreadProps {
    ticket: Ticket;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({ ticket }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">

            <div className="flex-1 overflow-y-auto p-6 bg-white/40">
                {ticket.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>


        </div>
    );
};
