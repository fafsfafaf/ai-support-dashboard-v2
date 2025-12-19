"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { TicketStatus } from '@/types';

export const StatusDropdown = ({ currentStatus, onStatusChange }: { currentStatus: TicketStatus, onStatusChange: (s: TicketStatus) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

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
            case 'resolved_ai': return 'Geschlossen (AI)';
            default: return s;
        }
    };

    const statusOptions: { value: TicketStatus, label: string, color: string }[] = [
        { value: 'open', label: 'Offen', color: 'bg-blue-500' },
        { value: 'waiting', label: 'Wartend', color: 'bg-yellow-400' },
        { value: 'closed', label: 'Geschlossen', color: 'bg-gray-500' },
        { value: 'resolved_ai', label: 'Resolved (AI)', color: 'bg-green-500' }
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 transition-colors ${getStatusStyle(currentStatus)}`}
            >
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
                {getStatusLabel(currentStatus)}
                <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 flex flex-col overflow-hidden origin-top-right"
                    >
                        {statusOptions.map((option) => {
                            const isActive = currentStatus === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => { onStatusChange(option.value); setIsOpen(false); }}
                                    className="px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center justify-between text-gray-700 font-medium w-full group transition-colors"
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
    );
};
