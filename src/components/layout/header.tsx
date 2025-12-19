
import React from 'react';
import { Search, HelpCircle, Bell, Settings, User } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HeaderProps {
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
    return (
        <header className={cn("h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20", className)}>
            {/* Logo - Temporary Recruitee placeholder */}
            <div className="flex-1 flex items-center gap-3">
                <img
                    src="https://recruitee.com/hubfs/raw_assets/public/Tellent_Theme_V3/bright/templates/assets/logo/tellent-logo.svg"
                    alt="Logo"
                    className="h-6"
                />
            </div>

            <div className="flex-1 flex justify-center max-w-2xl mx-4">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Suchen... (Tickets, Kunden, Bestellungen)"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className="text-gray-400 text-xs border border-gray-200 rounded px-1.5 py-0.5">⌘K</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
                <button className="text-gray-500 hover:text-gray-700 transition">
                    <HelpCircle className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition">
                    <Bell className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition">
                    <Settings className="h-5 w-5" />
                </button>

                <div className="h-6 w-px bg-gray-200 mx-1" />

                <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <div className="h-8 w-8 bg-[hsl(264,67%,43%)]/10 rounded-full flex items-center justify-center text-[hsl(264,67%,43%)] font-medium text-sm">
                        JD
                    </div>
                </button>
            </div>
        </header>
    );
};
