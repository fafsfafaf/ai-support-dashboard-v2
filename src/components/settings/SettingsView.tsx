'use client';

import React, { useState } from 'react';
import { MessageCircle, Code, ChevronLeft, Bot, Building2, Plug, Settings, Trash2, Plus, Flag, Cog, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/shared-components';
import { AIAgentDetail } from './AIAgentDetail';
import { IntegrationsView } from './IntegrationsView';
import { OrganisationView } from './OrganisationView';
import { Organization } from '../../types';

// --- Internal Layout Components ---

const SettingsSidebar = ({ activeItem, onNavigate }: { activeItem: string, onNavigate?: (page: string) => void }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
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
                <button
                    onClick={() => onNavigate?.('AI Agents')}
                    title={isCollapsed ? "AI Agents" : ""}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeItem === 'AI Agents' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <Bot className="w-4 h-4 shrink-0" />
                    {!isCollapsed && "AI Agents"}
                </button>
                <button
                    onClick={() => onNavigate?.('Organisation')}
                    title={isCollapsed ? "Organisation" : ""}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeItem === 'Organisation' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <Building2 className="w-4 h-4 shrink-0" />
                    {!isCollapsed && "Organisation"}
                </button>
                <button
                    onClick={() => onNavigate?.('Integrationen')}
                    title={isCollapsed ? "Integrationen" : ""}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeItem === 'Integrationen' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <Plug className="w-4 h-4 shrink-0" />
                    {!isCollapsed && "Integrationen"}
                </button>
            </div>
        </div>
    );
}

// --- Content Components ---

const AIAgentsListContent = ({ onNavigate, onConfigure }: { onNavigate?: (page: string) => void, onConfigure: () => void }) => (
    <div className="p-10">
        <div className="mb-10 flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">AI Agents</h1>
                <p className="text-gray-500 font-medium">Erstelle und verwalte deine AI Agents mit RAG-basierter Wissensdatenbank</p>
            </div>
            <button className="bg-[#F2ECF9] hover:bg-[#e5ddf3] text-[#6024B9] font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                Agent Erstellen
            </button>
        </div>

        <div className="grid grid-cols-1 max-w-md">
            {/* Agent Card: Emilio */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-[10px] relative shadow-sm">
                            4o mini
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Emilio</h3>
                            <p className="text-xs text-gray-500 mt-1">Zuletzt trainiert: 19.11.2025</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    <button
                        onClick={onConfigure}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Cog className="w-4 h-4" />
                        Konfigurieren
                    </button>
                    <button className="p-2 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Export ---

export const SettingsView = ({ activePage, onNavigate, currentOrg }: { activePage: string, onNavigate: (page: string) => void, currentOrg?: Organization }) => {
    // Determine effective content to show. If only 'Einstellungen' is active, default to 'AI Agents'.
    const effectivePage = activePage === 'Einstellungen' ? 'AI Agents' : activePage;
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');

    // Reset to list view if page changes
    React.useEffect(() => {
        setViewMode('LIST');
    }, [activePage]);

    return (
        <div className="flex h-full bg-white rounded-3xl overflow-hidden shadow-sm">
            <SettingsSidebar activeItem={effectivePage} onNavigate={onNavigate} />
            <div className="flex-1 overflow-y-auto bg-white relative custom-scrollbar">
                {effectivePage === 'AI Agents' && (
                    viewMode === 'LIST'
                        ? <AIAgentsListContent onNavigate={onNavigate} onConfigure={() => setViewMode('DETAIL')} />
                        : <AIAgentDetail onBack={() => setViewMode('LIST')} />
                )}
                {effectivePage === 'Integrationen' && <IntegrationsView />}
                {effectivePage === 'Organisation' && <OrganisationView currentOrg={currentOrg || { id: '0', name: 'Standard', initials: 'S', color: 'bg-blue-600', role: 'Admin' }} />}
            </div>
        </div>
    );
};
