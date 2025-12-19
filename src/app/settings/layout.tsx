"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Building2, Plug, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { name: 'AI Agents', icon: Bot, href: '/settings/agents' },
        { name: 'Organisation', icon: Building2, href: '/settings/organisation' },
        { name: 'Integrationen', icon: Plug, href: '/settings/integrations' },
    ];

    return (
        <DashboardShell className="flex-row overflow-hidden bg-white">
            {/* Internal Settings Sidebar */}
            <div className={`${isCollapsed ? 'w-20' : 'w-64'} border-r border-gray-200 h-full flex flex-col bg-white shrink-0 pt-6 transition-all duration-300 relative`}>
                <div className={`px-6 flex items-center gap-3 mb-6 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                    <Settings className="w-4 h-4 text-[#111827] shrink-0" />
                    {!isCollapsed && <h2 className="text-sm font-bold text-[#111827] whitespace-nowrap overflow-hidden">Einstellungen</h2>}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md ${isCollapsed ? 'absolute -right-3 top-6 bg-white border border-gray-200 shadow-sm z-10' : 'ml-auto'}`}
                    >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                <div className="px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isCollapsed ? item.name : ""}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {!isCollapsed && item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-white relative custom-scrollbar">
                {children}
            </div>
        </DashboardShell>
    );
}
