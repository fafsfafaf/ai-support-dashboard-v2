
"use client";

import React, { useState } from 'react';
import { TicketList } from './ticket-list';
import { ConversationThread } from './conversation-thread';
import { RightPanel } from './right-panel';
import { INITIAL_TICKETS, INITIAL_CUSTOMERS, DEMO_ORDERS } from '@/lib/data';
import { Ticket } from '@/types';
import { DashboardShell } from '../layout/dashboard-shell';

const InboxView = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket>(INITIAL_TICKETS[0]);

    // Derived state
    const currentCustomer = INITIAL_CUSTOMERS.find(c => c.id === selectedTicket?.customerId);
    const currentOrders = DEMO_ORDERS.filter(o => o.customerId === selectedTicket?.customerId);

    return (
        <DashboardShell className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_320px] divide-x divide-gray-100/50">
            {/* Left Column: Ticket List */}
            <section className="flex flex-col h-full min-h-0 bg-gray-50/30">
                <div className="h-14 px-4 border-b border-gray-100/50 flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">Inbox</h2>
                    <span className="text-xs font-medium text-gray-500 bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
                        {INITIAL_TICKETS.length}
                    </span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <TicketList
                        tickets={INITIAL_TICKETS}
                        activeTicketId={selectedTicket?.id}
                        onSelectTicket={setSelectedTicket}
                    />
                </div>
            </section>

            {/* Middle Column: Conversation */}
            <section className="flex flex-col h-full min-h-0 bg-white relative z-10">
                {selectedTicket ? (
                    <ConversationThread ticket={selectedTicket} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Select a ticket
                    </div>
                )}
            </section>

            {/* Right Column: Customer Info */}
            <section className="hidden xl:flex flex-col h-full min-h-0 bg-gray-50/30">
                <div className="h-14 px-4 border-b border-gray-100/50 flex items-center gap-2 shrink-0">
                    <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[10px] font-bold">
                        AM
                    </div>
                    <span className="font-bold text-sm text-gray-900">Details</span>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <RightPanel
                        customer={currentCustomer}
                        orders={currentOrders}
                    />
                </div>
            </section>
        </DashboardShell>
    );
};

export default InboxView;
