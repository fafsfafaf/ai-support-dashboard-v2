"use client";

import React, { useState } from 'react';
import { Plus, Cog, Trash2 } from 'lucide-react';
import { AIAgentDetail } from '@/components/settings/AIAgentDetail';

const AIAgentsListContent = ({ onConfigure }: { onConfigure: () => void }) => (
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

export default function AgentsPage() {
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');

    if (viewMode === 'DETAIL') {
        return <AIAgentDetail onBack={() => setViewMode('LIST')} />;
    }

    return <AIAgentsListContent onConfigure={() => setViewMode('DETAIL')} />;
}
