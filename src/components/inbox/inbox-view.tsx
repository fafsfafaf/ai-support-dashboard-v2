"use client";

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Filter,
    ArrowUpDown,
    Search,
    CheckSquare,
    Square,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    User
} from 'lucide-react';
import { Ticket, TicketStatus, Agent } from '@/types';
import { INITIAL_TICKETS, INITIAL_CUSTOMERS, DEMO_ORDERS, INITIAL_AGENTS } from '@/lib/data';
import { DashboardShell } from '../layout/dashboard-shell';
import { useTheme } from '@/context/theme-context';
import { cn } from '@/lib/cn';

// Components
import TicketCard from './TicketCard';
import ReplyEditor from './ReplyEditor';
import { RightPanel } from './right-panel';
import { ConversationThread } from './conversation-thread';
import { AssigneeMenu, FilterMenu, SortMenu } from './InboxActionMenus';
import { StatusDropdown } from '@/components/ui/StatusComponents';
import {
    TicketMetaModal,
    CreateReturnModal,
    OrdersModal,
    ConfirmationModal
} from './InboxModals';

const InboxView = () => {
    const { dividerColor } = useTheme();

    // State
    const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
    const [selectedTicketId, setSelectedTicketId] = useState<string>(INITIAL_TICKETS[0]?.id);
    const [selectedTicketIds, setSelectedTicketIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TicketStatus | null>(null);
    const [sortOrder, setSortOrder] = useState<'DATE_DESC' | 'DATE_ASC'>('DATE_DESC');

    // UI State
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

    // Modals
    const [showTicketMeta, setShowTicketMeta] = useState(false);
    const [showCreateReturn, setShowCreateReturn] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);

    // Derived Data
    const selectedTicket = useMemo(() =>
        tickets.find(t => t.id === selectedTicketId),
        [tickets, selectedTicketId]
    );

    const currentCustomer = useMemo(() =>
        INITIAL_CUSTOMERS.find(c => c.id === selectedTicket?.customerId),
        [selectedTicket]
    );

    const currentOrders = useMemo(() =>
        DEMO_ORDERS.filter(o => o.customerId === selectedTicket?.customerId),
        [selectedTicket]
    );

    const filteredTickets = useMemo(() => {
        let result = [...tickets];

        // Filter by Status
        if (statusFilter) {
            result = result.filter(t => t.status === statusFilter);
        }

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.subject.toLowerCase().includes(query) ||
                t.id.toLowerCase().includes(query) ||
                t.messages.some(m => m.content.toLowerCase().includes(query))
            );
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime();
            const dateB = new Date(b.updatedAt).getTime();
            return sortOrder === 'DATE_DESC' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [tickets, statusFilter, searchQuery, sortOrder]);

    // Handlers
    const handleTicketSelect = (ticket: Ticket) => {
        setSelectedTicketId(ticket.id);
        // If in multi-select mode (commented out logic if needed, but standard is single select preview)
    };

    const handleToggleSelect = (ticketId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSelected = new Set(selectedTicketIds);
        if (newSelected.has(ticketId)) {
            newSelected.delete(ticketId);
        } else {
            newSelected.add(ticketId);
        }
        setSelectedTicketIds(newSelected);
    };

    const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
        setTickets(prev => prev.map(t =>
            t.id === ticketId ? { ...t, status: newStatus } : t
        ));
    };

    const handleAssign = (ticketId: string, agentId: string | null) => {
        setTickets(prev => prev.map(t =>
            t.id === ticketId ? { ...t, assignedTo: agentId || undefined } : t
        ));
    };

    const handleSendReply = (content: string, mode: 'REPLY' | 'NOTE', attachments: File[], cc?: string, bcc?: string) => {
        if (!selectedTicket) return;

        console.log('Sending reply:', { content, mode, attachments, cc, bcc });
        // Mock sending
        const newMessage = {
            id: `m_${Date.now()}`,
            sender: 'AGENT' as const,
            content: mode === 'NOTE' ? `[INTERN] ${content}` : content,
            timestamp: new Date().toISOString(),
            attachments: attachments.map(f => ({
                id: `att_${Date.now()}`,
                name: f.name,
                url: URL.createObjectURL(f), // Mock URL
                type: f.type,
                size: f.size
            }))
        };

        setTickets(prev => prev.map(t =>
            t.id === selectedTicket.id
                ? { ...t, messages: [...t.messages, newMessage] }
                : t
        ));
    };

    // Bulk Actions
    const handleBulkStatusChange = (status: TicketStatus) => {
        setTickets(prev => prev.map(t =>
            selectedTicketIds.has(t.id) ? { ...t, status } : t
        ));
        setSelectedTicketIds(new Set());
    };

    return (
        <DashboardShell className="flex flex-col h-full divide-y divide-[#D8E0E3]">
            {/* Top Header */}
            <header className="h-16 px-4 flex items-center justify-between shrink-0 bg-white" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                {/* Left: Title & Tools */}
                <div className="flex items-center gap-4 w-[380px] shrink-0 pr-4">
                    <h2 className="text-xl font-bold text-[#1D1C21]">Inbox</h2>

                    <div className="flex items-center gap-2 relative">
                        {/* Filter Button */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-sm font-medium text-[#1D1C21] hover:bg-gray-50 transition-colors",
                                    isFilterMenuOpen && "bg-gray-50 ring-2 ring-primary/10 border-primary/50"
                                )}
                                style={{ borderColor: dividerColor }}
                            >
                                <Filter className="h-3.5 w-3.5 text-gray-500" />
                                <span>Filter</span>
                            </button>
                            {isFilterMenuOpen && (
                                <FilterMenu
                                    activeStatus={statusFilter}
                                    onStatusChange={(s: any) => { setStatusFilter(s); setIsFilterMenuOpen(false); }}
                                    onClose={() => setIsFilterMenuOpen(false)}
                                />
                            )}
                        </div>

                        {/* Sort Button */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-sm font-medium text-[#1D1C21] hover:bg-gray-50 transition-colors"
                                style={{ borderColor: dividerColor }}
                            >
                                <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                                <span>Sortieren</span>
                            </button>
                            {isSortMenuOpen && (
                                <SortMenu
                                    currentSort={sortOrder}
                                    onSortChange={(s: any) => { setSortOrder(s); setIsSortMenuOpen(false); }}
                                    onClose={() => setIsSortMenuOpen(false)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle: Conversation Header */}
                <div className="flex-1 flex items-center justify-between pl-6 h-8 my-auto">
                    {selectedTicket ? (
                        <>
                            <div className="flex flex-col justify-center min-w-0 pr-4">
                                <h3 className="font-bold text-[#1D1C21] text-lg truncate flex items-center gap-2">
                                    {selectedTicket.subject}
                                </h3>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {/* Status Badge/Dropdown */}
                                <StatusDropdown
                                    currentStatus={selectedTicket.status}
                                    onStatusChange={(s) => handleStatusChange(selectedTicket.id, s)}
                                />

                                <div className="h-5 w-px bg-gray-200 mx-1" />

                                <button
                                    onClick={() => setShowTicketMeta(true)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Ticket Details"
                                >
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400 text-sm">Kein Ticket ausgewählt</div>
                    )}
                </div>
            </header>

            {/* Main Content Info Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_320px]">

                {/* LEFT: Ticket List */}
                <section className="flex flex-col h-full min-h-0 bg-white border-r border-gray-200 relative">
                    {/* Search Bar */}
                    <div className="p-3 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Suchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Multi-Select Action Bar (if items selected) */}
                    <AnimatePresence>
                        {selectedTicketIds.size > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-primary/5 border-b border-primary/10 overflow-hidden"
                            >
                                <div className="px-4 py-2 flex items-center justify-between">
                                    <span className="text-xs font-bold text-primary">
                                        {selectedTicketIds.size} ausgewählt
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleBulkStatusChange('closed')}
                                            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm"
                                        >
                                            Schließen
                                        </button>
                                        <button
                                            onClick={() => setSelectedTicketIds(new Set())}
                                            className="p-1 hover:bg-primary/10 rounded text-primary"
                                        >
                                            <span className="sr-only">Clear</span>
                                            <Square className="w-4 h-4" />
                                            {/* Using text cancel for now or close icon*/}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-gray-50/50">
                        {filteredTickets.map(ticket => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                isSelected={selectedTicketId === ticket.id}
                                onClick={() => handleTicketSelect(ticket)}
                                isMultiSelected={selectedTicketIds.has(ticket.id)}
                                onToggleMultiSelect={() => {
                                    const newSelected = new Set(selectedTicketIds);
                                    if (newSelected.has(ticket.id)) {
                                        newSelected.delete(ticket.id);
                                    } else {
                                        newSelected.add(ticket.id);
                                    }
                                    setSelectedTicketIds(newSelected);
                                }}
                                onStatusChange={(s) => handleStatusChange(ticket.id, s)}
                                onAssign={(a) => handleAssign(ticket.id, a)}
                                agents={INITIAL_AGENTS}
                                customers={INITIAL_CUSTOMERS}
                            />
                        ))}

                        {filteredTickets.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <p className="text-sm">Keine Tickets gefunden</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* MIDDLE: Conversation */}
                <section className="flex flex-col h-full min-h-0 bg-white relative z-0 border-r border-gray-200">
                    {selectedTicket ? (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                                <ConversationThread ticket={selectedTicket} />
                            </div>

                            {/* Editor Area */}
                            <div className="shrink-0 bg-white border-t border-gray-200 p-4 z-20 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)]">
                                <ReplyEditor
                                    onSend={handleSendReply}
                                    customerEmail={currentCustomer?.email}
                                    initialContent=""
                                />
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Kein Ticket ausgewählt</h3>
                            <p className="text-sm">Wählen Sie ein Ticket aus der Liste, um Details zu sehen.</p>
                        </div>
                    )}
                </section>

                {/* RIGHT: Customer Info */}
                <section className="hidden xl:flex flex-col h-full min-h-0 bg-white">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <RightPanel
                            customer={currentCustomer}
                            orders={currentOrders}
                        />
                    </div>
                </section>
            </div>

            {/* Modals */}
            {selectedTicket && (
                <>
                    <TicketMetaModal
                        isOpen={showTicketMeta}
                        onClose={() => setShowTicketMeta(false)}
                        ticket={selectedTicket}
                        agents={INITIAL_AGENTS}
                    />
                    <CreateReturnModal
                        isOpen={showCreateReturn}
                        onClose={() => setShowCreateReturn(false)}
                        customer={currentCustomer}
                        orders={currentOrders}
                    />
                    <OrdersModal
                        isOpen={showOrdersModal}
                        onClose={() => setShowOrdersModal(false)}
                        orders={currentOrders}
                        customerEmail={currentCustomer?.email}
                    />
                </>
            )}
        </DashboardShell>
    );
};

export default InboxView;
