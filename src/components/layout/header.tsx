
import React from 'react';
import { Search, HelpCircle, Bell, Settings, User } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HeaderProps {
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
    return (
        <header className={cn("h-16 flex items-center justify-between px-6 z-20", className)}>
            <div className="flex-1 flex items-center gap-3">
                {/* Logo moved to Sidebar */}
            </div>

            <div className="flex-1 flex justify-center max-w-2xl mx-4">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-[#1D1C21]/50" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200/60 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#6024B9] focus:border-[#6024B9] sm:text-sm transition duration-150 ease-in-out shadow-sm text-[#1D1C21]"
                        placeholder="Suchen... (Tickets, Kunden, Bestellungen)"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className="text-gray-400 text-xs border border-gray-200 rounded px-1.5 py-0.5">⌘K</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
                <button className="text-[#1D1C21] hover:text-black transition lg:hidden">
                    <Settings className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-4">
                    <button className="text-[#1D1C21] hover:text-black transition">
                        <HelpCircle className="h-5 w-5" />
                    </button>
                    <button className="text-[#1D1C21] hover:text-black transition">
                        <Bell className="h-5 w-5" />
                    </button>
                    <button className="flex items-center gap-2 text-[#1D1C21] hover:text-black">
                        <div className="h-8 w-8 bg-[#6024B9]/10 rounded-full flex items-center justify-center text-[#6024B9] font-medium text-sm">
                            JD
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};
