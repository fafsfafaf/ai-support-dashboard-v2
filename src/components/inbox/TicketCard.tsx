
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Instagram, Mail, MessageCircle, Check, FileText, Paperclip, Clock, ChevronDown, Tag as TagIcon, Sparkles } from 'lucide-react';
import { Ticket, Customer, TicketStatus, Agent } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AssigneeMenu } from './InboxActionMenus';

interface TicketCardProps {
    ticket: Ticket;
    isSelected: boolean;
    isMultiSelected: boolean;
    onClick: () => void;
    onToggleMultiSelect: () => void;
    customers: Customer[];
    agents?: Agent[];
    onStatusChange: (status: TicketStatus) => void;
    onShowAgent?: (agent: Agent) => void;
    onAssign?: (agentId: string | null) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
    ticket,
    isSelected,
    isMultiSelected,
    onClick,
    onToggleMultiSelect,
    customers,
    agents = [],
    onStatusChange,
    onShowAgent,
    onAssign
}) => {
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
    const statusMenuRef = useRef<HTMLDivElement>(null);
    const assigneeMenuRef = useRef<HTMLDivElement>(null);

    const currentCustomer = customers.find(c => c.id === ticket.customerId);
    const initials = `${currentCustomer?.firstName[0] || '?'}${currentCustomer?.lastName[0] || ''}`;

    const assignedAgent = ticket.assignedTo ? agents.find(a => a.id === ticket.assignedTo) : null;

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
                setShowStatusMenu(false);
            }
            if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(event.target as Node)) {
                setShowAssigneeMenu(false);
            }
        };

        if (showStatusMenu || showAssigneeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showStatusMenu, showAssigneeMenu]);

    // Time logic
    const date = new Date(ticket.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let timeStr = '';
    if (diffMinutes < 60) timeStr = `${diffMinutes}m`;
    else if (diffHours < 24) timeStr = `${diffHours}h`;
    else timeStr = `${diffDays}d`;

    const formattedDate = date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // Avatar Color Logic
    const avatarColor = ticket.id.includes('5') ? 'bg-purple-600' : 'bg-indigo-600';

    // Status Colors
    const getStatusStyle = (s: TicketStatus) => {
        switch (s) {
            case 'waiting': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'closed': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'resolved_ai': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (s: TicketStatus) => {
        switch (s) {
            case 'waiting': return 'Wartend';
            case 'open': return 'Offen';
            case 'closed': return 'Geschlossen';
            case 'resolved_ai': return 'Geschlossen';
            default: return s;
        }
    };

    // Tag Styling Logic
    const getTagStyle = (tag: string) => {
        if (tag.toLowerCase().includes('ki gelöst')) {
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
        if (tag.toLowerCase().includes('return') || tag.toLowerCase().includes('retoure')) {
            return 'bg-rose-50 text-rose-700 border-rose-200';
        }
        if (tag.toLowerCase().includes('support-archiv') || tag.toLowerCase().includes('archiv')) {
            return 'bg-orange-50 text-orange-700 border-orange-200';
        }
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const statusOptions = [
        { value: 'open', label: 'Offen', color: 'bg-green-500' },
        { value: 'waiting', label: 'Wartend', color: 'bg-yellow-400' },
        { value: 'closed', label: 'Geschlossen', color: 'bg-gray-500' }
    ];

    const zIndexClass = (showStatusMenu || showAssigneeMenu)
        ? 'z-40'
        : (isSelected ? 'z-10' : 'z-0');

    return (
        <div
            onClick={onClick}
            className={`
            relative group rounded-2xl border bg-white mb-3 cursor-pointer transition-all duration-200 ease-out
            ${zIndexClass}
            ${isSelected
                    ? 'border-blue-500 ring-1 ring-blue-100 shadow-md translate-x-0'
                    : 'border-gray-200 shadow-sm hover:translate-x-1.5 hover:border-gray-300 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)]'
                }
          `}
        >
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleMultiSelect();
                }}
                className={`absolute top-4 -left-3 z-20 transition-all duration-200 ${isMultiSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}
            >
                <div className={`
                w-6 h-6 rounded-full border shadow-sm flex items-center justify-center cursor-pointer bg-white
                ${isMultiSelected
                        ? 'border-blue-600 text-blue-600'
                        : 'border-gray-300 text-transparent hover:border-blue-400'
                    }
             `}>
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
            </div>

            <div className="p-4 pb-3">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        {ticket.isUnread && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-0.5" title="Ungelesen"></div>
                        )}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColor}`}>
                            {initials}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{currentCustomer?.firstName} {currentCustomer?.lastName}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{timeStr}</span>
                </div>

                <div className="mb-4 pl-0">
                    <h4 className="font-bold text-gray-900 text-[13px] leading-snug line-clamp-2 mb-1">
                        {ticket.subject.startsWith('Re:') ? ticket.subject : `Re: ${ticket.subject}`}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                        Neue Kundennachricht vom {formattedDate}
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-2 relative z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 ${getTagStyle('Support-Archiv')}`}>
                        <TagIcon className="w-3 h-3" />
                        Support-Archiv
                    </span>

                    <div className="relative" ref={statusMenuRef} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowStatusMenu(!showStatusMenu)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-colors ${getStatusStyle(ticket.status)}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full bg-current opacity-60`}></div>
                            {getStatusLabel(ticket.status)}
                            <ChevronDown className={`w-3 h-3 opacity-50 ml-0.5 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showStatusMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                                    className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 flex flex-col overflow-hidden origin-top-left"
                                >
                                    {statusOptions.map((option) => {
                                        const isActive = ticket.status === option.value || (option.value === 'closed' && ticket.status === 'resolved_ai');
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => { onStatusChange(option.value as TicketStatus); setShowStatusMenu(false); }}
                                                className="px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center justify-between text-gray-700 font-medium w-full group transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                                                    {option.label}
                                                </div>
                                                {isActive && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200 w-full"></div>

            <div className="px-4 py-3 flex items-center justify-between">
                <div className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-[10px] font-bold font-mono border border-gray-200">
                    #{ticket.id}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-400" title={`${ticket.messages.length} Nachrichten`}>
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold pt-0.5">{ticket.messages.length}</span>
                    </div>

                    <div className="text-gray-400" title="Email">
                        <Mail className="w-3.5 h-3.5" />
                    </div>

                    <div className="text-gray-400" title="Anhänge">
                        <Paperclip className="w-3.5 h-3.5" />
                    </div>

                    <div className="relative" ref={assigneeMenuRef} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowAssigneeMenu(!showAssigneeMenu)}
                            className="relative block hover:scale-105 transition-transform"
                            title={assignedAgent ? `Zugewiesen an ${assignedAgent.name}` : "Nicht zugewiesen"}
                        >
                            {assignedAgent ? (
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-white ${assignedAgent.color || 'bg-gray-500'}`}>
                                    {assignedAgent.initials}
                                </div>
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors">
                                    <span className="text-[8px] text-gray-400">?</span>
                                </div>
                            )}
                        </button>

                        <AnimatePresence>
                            {showAssigneeMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                                    className="absolute bottom-full right-0 mb-2 z-50 origin-bottom-right"
                                >
                                    <AssigneeMenu
                                        agents={agents}
                                        currentAssigneeId={ticket.assignedTo}
                                        onAssign={(id: string | null) => { if (onAssign) onAssign(id); setShowAssigneeMenu(false); }}
                                        onAddAgent={() => { /* Placeholder for add agent from card */ setShowAssigneeMenu(false); }}
                                        onClose={() => setShowAssigneeMenu(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
