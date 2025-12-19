
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
            <div className="mb-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Filter size={14} /> Filter
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <ArrowUpDown size={14} /> Sortieren
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
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
