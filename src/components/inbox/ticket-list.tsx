
import React from 'react';
import { Ticket } from '@/types';
import { TicketListItem } from './ticket-list-item';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpDown } from 'lucide-react';

interface TicketListProps {
    tickets: Ticket[];
    activeTicketId?: string;
    onSelectTicket: (ticket: Ticket) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, activeTicketId, onSelectTicket }) => {
    return (
        <div className="flex flex-col h-full bg-transparent min-w-0">
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide space-y-3">
                {tickets.map((ticket) => (
                    <TicketListItem
                        key={ticket.id}
                        ticket={ticket}
                        isActive={activeTicketId === ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                    />
                ))}
            </div>
        </div>
    );
};
