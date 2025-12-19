'use client';

import React, { useState } from 'react';
import {
    Trash2, Plus, Settings, ExternalLink, ShieldCheck,
    Globe, Key, CheckCircle2, RefreshCw, X
} from 'lucide-react';
import { ConfirmationModal } from '../inbox/InboxModals';

interface Integration {
    id: string;
    name: string;
    domain?: string;
    logo: string;
    type: 'E-COMMERCE' | 'MARKETING' | 'Fulfillment';
    connectionType?: 'App Store' | 'Custom App';
}

const AVAILABLE_PROVIDERS = [
    { id: 'shopify', name: 'Shopify', sub: 'Verbinde deinen Shopify Store', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg', color: '#00b84c' }
];

export const IntegrationsView = () => {
    const [activeIntegrations, setActiveIntegrations] = useState<Integration[]>([]);
    const [isConnectingShopify, setIsConnectingShopify] = useState(false);
    const [shopifyTab, setShopifyTab] = useState<'APP_STORE' | 'CUSTOM_APP'>('APP_STORE');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);

    // Form States
    const [shopDomain, setShopDomain] = useState('');
    const [apiToken, setApiToken] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    // Config Modal State
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [integrationToId, setIntegrationToId] = useState<string | null>(null);

    const handleRemoveClick = (id: string) => {
        setIntegrationToId(id);
        setShowDeleteConfirm(true);
    };

    const confirmRemove = () => {
        if (integrationToId) {
            setActiveIntegrations(prev => prev.filter(i => i.id !== integrationToId));
            setIntegrationToId(null);
            setShowDeleteConfirm(false);
            setShowConfigModal(false);
        }
    };

    const handleSaveShopify = () => {
        setIsSaving(true);
        setTimeout(() => {
            const newIntegration: Integration = {
                id: 'shopify',
                name: 'Shopify',
                domain: shopDomain || 'temply-demo.myshopify.com',
                logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
                type: 'E-COMMERCE',
                connectionType: shopifyTab === 'APP_STORE' ? 'App Store' : 'Custom App'
            };

            setActiveIntegrations([newIntegration]);
            setIsConnectingShopify(false);
            setShowConfigModal(false);
            setIsSaving(false);
            setShowSuccessBanner(true);
            setTimeout(() => setShowSuccessBanner(false), 5000);
        }, 800);
    };

    const handleTestConnection = () => {
        setIsTesting(true);
        setTimeout(() => setIsTesting(false), 1500);
    };

    const openSettings = (integration: Integration) => {
        if (integration.id === 'shopify') {
            setShopDomain(integration.domain || '');
            setShopifyTab(integration.connectionType === 'App Store' ? 'APP_STORE' : 'CUSTOM_APP');
            setShowConfigModal(true);
        }
    };

    const isShopifyActive = activeIntegrations.some(i => i.id === 'shopify');

    return (
        <div className="h-full flex flex-col bg-[#FAF9FC] overflow-hidden p-8 lg:p-10 select-none">
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmRemove}
                title="Integration entfernen?"
                message="Möchten Sie diese Integration wirklich löschen? Die Synchronisierung der Daten wird sofort gestoppt."
                confirmLabel="Entfernen"
                isDestructive={true}
            />

            {/* Configuration Modal for Active Shopify Integration */}
            {showConfigModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" className="w-5 h-5" alt="Shopify" />
                                <h3 className="font-bold text-gray-900">Shopify konfigurieren</h3>
                            </div>
                            <button onClick={() => setShowConfigModal(false)} className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Shop Domain</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9] font-bold text-gray-900"
                                        value={shopDomain}
                                        onChange={(e) => setShopDomain(e.target.value)}
                                    />
                                </div>
                                {shopifyTab === 'CUSTOM_APP' && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Admin API Access Token</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9] font-bold text-gray-900"
                                            placeholder="••••••••••••••••"
                                            value={apiToken}
                                            onChange={(e) => setApiToken(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
                                <button
                                    onClick={handleSaveShopify}
                                    disabled={isSaving}
                                    className="w-full bg-[#F2ECF9] hover:bg-[#e5ddf3] text-[#6024B9] py-2.5 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Änderungen speichern"}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleTestConnection}
                                        className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verbindung testen"}
                                    </button>
                                    <button
                                        onClick={() => handleRemoveClick('shopify')}
                                        className="flex-1 py-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Entfernen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="shrink-0 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Integrationen</h1>
                <p className="text-gray-500 font-medium text-sm">Verbinde deine E-Commerce-Plattformen</p>
            </div>

            {/* Success Alert */}
            {showSuccessBanner && (
                <div className="shrink-0 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#16a34a]" strokeWidth={2.5} />
                        <span className="text-[#16a34a] font-bold text-sm">Shopify-Integration erfolgreich gespeichert!</span>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col">

                {/* Active Integrations Section */}
                {activeIntegrations.length > 0 && (
                    <div className="shrink-0 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-bold text-gray-900 text-sm">Aktive Integrationen</h3>
                            <span className="bg-[#F2ECF9] text-[#6024B9] text-xs font-bold px-2 py-0.5 rounded-lg">{activeIntegrations.length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeIntegrations.map(integration => (
                                <div key={integration.id} className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-col shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden shadow-inner">
                                                <img src={integration.logo} className="w-7 h-7" alt={integration.name} />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-gray-900 text-base">{integration.name}</h4>
                                                <p className="text-xs text-gray-400 font-bold mt-0.5 tracking-tight">{integration.domain}</p>
                                                <div className="flex items-center gap-1.5 mt-3">
                                                    <div className="w-2 h-2 bg-[#22c55e] rounded-full"></div>
                                                    <span className="text-[11px] font-bold text-[#22c55e] uppercase tracking-wider">Aktiv ({integration.connectionType})</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openSettings(integration)}
                                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                                                title="Konfigurieren"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveClick(integration.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Entfernen"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Integrations Section */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-6">
                        <h3 className="font-bold text-gray-900 text-sm">Verfügbare Integrationen</h3>
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-gray-200 uppercase tracking-widest">{AVAILABLE_PROVIDERS.length - activeIntegrations.length} verfügbar</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!isShopifyActive && (
                            <div className={`transition-all duration-300 ${isConnectingShopify ? 'col-span-1 border-2 border-[#bbf7d0] bg-white' : 'bg-white border border-gray-200'} rounded-3xl flex flex-col p-6 shadow-sm`}>
                                {isConnectingShopify ? (
                                    <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                                                <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" className="w-6 h-6" alt="Shopify" />
                                            </div>
                                            <h4 className="font-extrabold text-gray-900 text-lg tracking-tight">Shopify verbinden</h4>
                                        </div>

                                        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-6 border border-gray-200/50">
                                            <button
                                                onClick={() => setShopifyTab('APP_STORE')}
                                                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${shopifyTab === 'APP_STORE' ? 'bg-white text-gray-900 shadow-sm border border-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                App Store
                                            </button>
                                            <button
                                                onClick={() => setShopifyTab('CUSTOM_APP')}
                                                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${shopifyTab === 'CUSTOM_APP' ? 'bg-white text-gray-900 shadow-sm border border-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                Custom App
                                            </button>
                                        </div>

                                        {shopifyTab === 'APP_STORE' ? (
                                            <div className="flex flex-col flex-1">
                                                <p className="text-sm text-gray-600 leading-relaxed font-medium mb-8">
                                                    Verbinde dich direkt mit deinem Shopify-Shop. Du wirst zu Shopify weitergeleitet, wo du dich einloggen und die App autorisieren kannst.
                                                </p>
                                                <div className="flex items-center gap-4 mt-auto">
                                                    <button
                                                        onClick={handleSaveShopify}
                                                        className="flex-1 bg-[#00b84c] hover:bg-[#00a344] text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Jetzt verbinden
                                                    </button>
                                                    <button
                                                        onClick={() => setIsConnectingShopify(false)}
                                                        className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors px-2"
                                                    >
                                                        Abbrechen
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 flex flex-col flex-1">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 ml-1">Shop Domain</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9] font-bold placeholder:text-gray-300 transition-all text-gray-900"
                                                        placeholder="mein-shop.myshopify.com"
                                                        value={shopDomain}
                                                        onChange={(e) => setShopDomain(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 ml-1">Admin API Access Token</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9] font-bold placeholder:text-gray-300 transition-all text-gray-900"
                                                        placeholder="shpat_xxxxx"
                                                        value={apiToken}
                                                        onChange={(e) => setApiToken(e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-2 mt-auto pt-4">
                                                    <button
                                                        onClick={handleTestConnection}
                                                        disabled={isTesting}
                                                        className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                                                    >
                                                        {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Testen"}
                                                    </button>
                                                    <button
                                                        onClick={handleSaveShopify}
                                                        disabled={isSaving}
                                                        className="flex-[2] bg-[#F2ECF9] hover:bg-[#e5ddf3] text-[#6024B9] py-3 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                                    >
                                                        {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                                                        Speichern
                                                    </button>
                                                    <button
                                                        onClick={() => setIsConnectingShopify(false)}
                                                        className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors px-2"
                                                    >
                                                        Abbrechen
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center h-full group">
                                        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform overflow-hidden border border-gray-100">
                                            <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" className="w-9 h-9" alt="Shopify" />
                                        </div>
                                        <h4 className="font-extrabold text-gray-900 mb-1 text-lg tracking-tight">Shopify</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed mb-10 px-2 font-bold uppercase tracking-wider">
                                            Verbinde deinen Shopify Store
                                        </p>
                                        <button
                                            onClick={() => setIsConnectingShopify(true)}
                                            className="w-full py-3 rounded-2xl text-sm font-bold transition-all shadow-sm mt-auto active:scale-95 flex items-center justify-center gap-2 bg-[#00b84c] hover:bg-[#00a344] text-white shadow-green-100"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Jetzt verbinden
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dashed Placeholder */}
                        <div className="bg-gray-50/50 border border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-default h-full">
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:rotate-90 transition-transform">
                                <Plus className="w-6 h-6 text-gray-400" strokeWidth={3} />
                            </div>
                            <h4 className="font-extrabold text-gray-700 text-sm mb-1">Weitere Integrationen</h4>
                            <p className="text-xs text-gray-400 mb-6 px-4 font-bold tracking-tight">WooCommerce, Magento und weitere Plattformen</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-gray-100/50 px-4 py-2 rounded-full border border-gray-200 uppercase tracking-widest">
                                <RefreshCw className="w-3 h-3" /> Bald verfügbar
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
