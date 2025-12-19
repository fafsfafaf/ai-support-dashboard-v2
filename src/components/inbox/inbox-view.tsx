
"use client";

import React, { useState } from 'react';
import { TicketList } from './ticket-list';
import { ConversationThread } from './conversation-thread';
import { RightPanel } from './right-panel';
import { INITIAL_TICKETS, INITIAL_CUSTOMERS, DEMO_ORDERS } from '@/lib/data';
import { Ticket } from '@/types';
import { DashboardShell } from '../layout/dashboard-shell';
import { useTheme } from '@/context/theme-context';
import { Filter, ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/cn';

const InboxView = () => {
    const { dividerColor } = useTheme();
    const [selectedTicket, setSelectedTicket] = useState<Ticket>(INITIAL_TICKETS[0]);

    // Derived state
    const currentCustomer = INITIAL_CUSTOMERS.find(c => c.id === selectedTicket?.customerId);
    const currentOrders = DEMO_ORDERS.filter(o => o.customerId === selectedTicket?.customerId);

    return (
        <DashboardShell className="flex flex-col h-full divide-y divide-[#D8E0E3]">
            {/* Top Bar (Unified Header) */}
            <header
                className="h-16 px-4 flex items-center justify-between shrink-0 bg-white"
                style={{ borderBottom: `1px solid ${dividerColor}` }}
            >
                <div className="flex items-center gap-4 w-[380px] shrink-0 pr-4">
                    <h2 className="text-xl font-bold text-[#1D1C21]">Inbox</h2>

                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-sm font-medium text-[#1D1C21] hover:bg-gray-50 transition-colors"
                            style={{ borderColor: dividerColor }}
                        >
                            <Filter className="h-3.5 w-3.5 text-gray-500" />
                            <span>Filter</span>
                        </button>
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-sm font-medium text-[#1D1C21] hover:bg-gray-50 transition-colors"
                            style={{ borderColor: dividerColor }}
                        >
                            <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                            <span>Sortieren</span>
                        </button>
                    </div>
                </div>

                <div
                    className="flex-1 flex items-center justify-between pl-6 h-8 my-auto"
                >
                    {selectedTicket ? (
                        <>
                            <div className="flex flex-col justify-center min-w-0 pr-4">
                                <h3 className="font-bold text-[#1D1C21] text-base truncate">
                                    {selectedTicket.subject}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                    <span>via {selectedTicket.channel || 'EMAIL'}</span>
                                    <span>•</span>
                                    <span>Ticket #{selectedTicket.id}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                                    Resolve
                                </button>
                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                                <div className="h-4 w-px bg-gray-200 mx-1" />
                                <span className={cn(
                                    "text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide border",
                                    selectedTicket.status === 'closed'
                                        ? "bg-gray-100 text-gray-600 border-gray-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                )}>
                                    {selectedTicket.status === 'closed' ? 'Geschlossen' : 'Offen'}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400 text-sm">Kein Ticket ausgewählt</div>
                    )}
                </div>
            </header>

            {/* Main Layout (3 Columns) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_320px]">
                {/* Left Column: Ticket List */}
                <section
                    className="flex flex-col h-full min-h-0 bg-white"
                    style={{ borderRight: `1px solid ${dividerColor}` }}
                >
                    <div className="flex-1 overflow-hidden">
                        <TicketList
                            tickets={INITIAL_TICKETS}
                            activeTicketId={selectedTicket?.id}
                            onSelectTicket={setSelectedTicket}
                        />
                    </div>
                </section>

                {/* Middle Column: Conversation */}
                <section
                    className="flex flex-col h-full min-h-0 bg-white relative z-10"
                    style={{ borderRight: `1px solid ${dividerColor}` }}
                >
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
                    <div className="flex-1 overflow-auto">
                        <RightPanel
                            customer={currentCustomer}
                            orders={currentOrders}
                        />
                    </div>
                </section>
            </div>
        </DashboardShell>
    );
};

export default InboxView;
