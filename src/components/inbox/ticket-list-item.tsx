
import React from 'react';
import { Ticket } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { Mail, MessageCircle, Instagram, ShoppingBag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface TicketListItemProps {
    ticket: Ticket;
    isActive: boolean;
    onClick: () => void;
}

export const TicketListItem: React.FC<TicketListItemProps> = ({ ticket, isActive, onClick }) => {
    const ChannelIcon = {
        'EMAIL': Mail,
        'WHATSAPP': MessageCircle,
        'INSTAGRAM': Instagram,
        'SHOP': ShoppingBag
    }[ticket.channel || 'EMAIL'] || Mail;

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-3 rounded-xl border mb-3 cursor-pointer transition-all hover:shadow-md",
                isActive
                    ? "bg-white border-primary/40 shadow-sm ring-1 ring-primary/10"
                    : "bg-white border-gray-200 hover:border-gray-300"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-full bg-gray-100", isActive && "bg-primary/10 text-primary")}>
                        <ChannelIcon size={14} />
                    </div>
                    <span className="font-semibold text-sm text-gray-900 truncate max-w-[120px]">
                        {ticket.assignedTo || 'Unassigned'}
                    </span>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true, locale: de })}
                </span>
            </div>

            <h4 className={cn("font-medium text-sm mb-1 line-clamp-2", isActive ? "text-primary" : "text-gray-800")}>
                {ticket.subject}
            </h4>

            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {ticket.messages[ticket.messages.length - 1]?.content || 'No preview available'}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'} className="capitalize">
                    {ticket.status.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-gray-400">#{ticket.id.slice(0, 8)}</span>
            </div>
        </div>
    );
};
