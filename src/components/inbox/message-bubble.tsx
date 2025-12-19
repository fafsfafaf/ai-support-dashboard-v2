
import React from 'react';
import { TicketMessage } from '@/types';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
    message: TicketMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isAgent = message.sender === 'AGENT' || message.sender === 'AI';
    const isAI = message.sender === 'AI';
    const isInternal = message.isInternal;

    return (
        <div className={cn("flex gap-4 max-w-3xl mb-6", isAgent ? "" : "")}>
            <Avatar
                fallback={isAI ? 'AI' : (isAgent ? 'AG' : 'CU')}
                className={cn("mt-1", isAI && "bg-purple-100 text-purple-700")}
            />

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                        {isAI ? 'AI Assistant' : (isAgent ? 'Support Agent' : 'Customer')}
                    </span>
                    <span className="text-xs text-gray-400">
                        {format(new Date(message.timestamp), 'dd. MMM HH:mm')}
                    </span>
                    {isInternal && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">
                            Internal Note
                        </span>
                    )}
                </div>

                <div className={cn(
                    "p-4 rounded-xl text-sm leading-relaxed border",
                    isInternal
                        ? "bg-yellow-50 border-yellow-200 text-gray-800"
                        : (isAgent
                            ? "bg-white border-gray-200 text-gray-800"
                            : "bg-white border-gray-200 text-gray-800"
                        )
                )}>
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                </div>
            </div>
        </div>
    );
};
