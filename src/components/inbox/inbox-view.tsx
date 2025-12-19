
"use client";

import React, { useState } from 'react';
import { TicketList } from './ticket-list';
import { ConversationThread } from './conversation-thread';
import { RightPanel } from './right-panel';
import { MOCK_TICKETS, MOCK_CUSTOMERS, MOCK_ORDERS } from '@/data';
import { Ticket } from '@/types';

const InboxView = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket>(MOCK_TICKETS[0]);

    // Derived state
    const currentCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedTicket?.customerId);
    const currentOrders = MOCK_ORDERS.filter(o => o.customerId === selectedTicket?.customerId);

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_320px] gap-6 text-left">
            {/* Left Column: Ticket List */}
            <section className="flex flex-col h-full min-h-0">
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Inbox</h2>
                <TicketList
                    tickets={MOCK_TICKETS}
                    activeTicketId={selectedTicket?.id}
                    onSelectTicket={setSelectedTicket}
                />
            </section>

            {/* Middle Column: Conversation */}
            <section className="flex flex-col h-full min-h-0">
                {selectedTicket ? (
                    <ConversationThread ticket={selectedTicket} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 border border-dashed rounded-xl border-gray-200">
                        Select a ticket
                    </div>
                )}
            </section>

            {/* Right Column: Customer Info */}
            <section className="hidden xl:flex flex-col h-full min-h-0">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
                        AM
                    </div>
                    <span className="font-bold text-gray-900">Information</span>
                </div>

                <RightPanel
                    customer={currentCustomer}
                    orders={currentOrders}
                />
            </section>
        </div>
    );
};

export default InboxView;
