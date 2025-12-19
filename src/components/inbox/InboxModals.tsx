
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, User, Hash, AlertCircle, MessageSquare, Mail, Instagram, MessageCircle, Bot, Smile, CheckCircle2, Package, Truck, Receipt, MapPin, Tag as TagIcon, AlertTriangle, HelpCircle, Search, ChevronRight, ArrowLeft, Box, FileText } from 'lucide-react';
import { Ticket, Customer, Agent, Order, OrderLineItem } from '../../types';

export const TicketMetaModal = ({ isOpen, onClose, ticket, agents }: { isOpen: boolean, onClose: () => void, ticket: Ticket, agents?: Agent[] }) => {
    if (!isOpen) return null;

    const assignedAgent = agents?.find(a => a.id === ticket.assignedTo);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getChannelIcon = (channel?: string) => {
        switch (channel) {
            case 'INSTAGRAM': return <Instagram className="w-3.5 h-3.5 text-pink-600" />;
            case 'WHATSAPP': return <MessageCircle className="w-3.5 h-3.5 text-green-600" />;
            default: return <Mail className="w-3.5 h-3.5 text-blue-600" />;
        }
    };

    // Logic for resolution type
    const isAISolved = ticket.status === 'resolved_ai' || ticket.tags.includes('KI Gelöst');
    const isClosed = ticket.status === 'closed' || ticket.status === 'resolved_ai';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        Ticket Details
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Subject */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Betreff</label>
                        <div className="text-gray-900 font-bold text-sm leading-relaxed">{ticket.subject}</div>
                    </div>

                    {/* Grid for key details */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Ticket ID</label>
                            <div className="font-mono text-xs font-bold text-gray-700 border border-gray-200 rounded px-2.5 py-1 w-fit bg-white shadow-sm">{ticket.id}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Priorität</label>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${ticket.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
                                    ticket.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        'bg-green-50 text-green-700 border-green-100'
                                }`}>
                                {ticket.priority === 'HIGH' ? 'Hoch' : ticket.priority === 'MEDIUM' ? 'Mittel' : 'Niedrig'}
                            </span>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Kanal</label>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 border border-gray-200 rounded-md px-2.5 py-1 w-fit bg-white shadow-sm uppercase">
                                {getChannelIcon(ticket.channel)}
                                {ticket.channel || 'EMAIL'}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Status</label>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white text-gray-700 border border-gray-200 uppercase shadow-sm">
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Resolution Field - AI vs Human */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Lösung durch</label>
                            <div className="flex items-center gap-1.5">
                                {isClosed ? (
                                    isAISolved ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                            <Bot className="w-3.5 h-3.5" /> AI
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100 shadow-sm">
                                            <User className="w-3.5 h-3.5" /> Human
                                        </span>
                                    )
                                ) : (
                                    <span className="text-xs text-gray-400 font-medium italic px-1">Ausstehend</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Assigned Agent */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Zugewiesen an</label>
                        {assignedAgent ? (
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${assignedAgent.color || 'bg-gray-500'}`}>
                                    {assignedAgent.initials}
                                </div>
                                <span className="text-sm font-bold text-gray-900">{assignedAgent.name}</span>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic flex items-center gap-2">
                                <User className="w-4 h-4" /> Nicht zugewiesen
                            </div>
                        )}
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Erstellt am</label>
                            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span>{formatDate(ticket.createdAt)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Letztes Update</label>
                            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span>{formatDate(ticket.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AgentDetailModal = ({ isOpen, onClose, agent }: { isOpen: boolean, onClose: () => void, agent: Agent | null }) => {
    if (!isOpen || !agent) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[300px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative p-5">
                    <button onClick={onClose} className="absolute top-2 right-2 text-white/80 hover:text-white"><X className="w-4 h-4" /></button>
                    <div className={`w-14 h-14 rounded-full border-4 border-white/20 shadow-md flex items-center justify-center text-lg font-bold text-white ${agent.color || 'bg-gray-500'}`}>
                        {agent.initials}
                    </div>
                </div>
                <div className="px-5 pb-5 pt-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-4">{agent.email}</p>

                        <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Calendar className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase">Aktiv Seit</div>
                                    <div className="font-medium text-xs">{agent.activeSince || 'Unbekannt'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase">Status</div>
                                    <div className="font-medium text-green-600 text-xs">Aktiv</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const WebhookPayloadModal = ({ isOpen, onClose, ticket }: { isOpen: boolean, onClose: () => void, ticket: Ticket }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-[600px] p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Webhook Payload</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900"><X className="w-4 h-4" /></button>
                </div>
                <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-auto max-h-[400px]">
                    {JSON.stringify({ event: 'ticket.updated', data: ticket }, null, 2)}
                </div>
            </div>
        </div>
    );
};

// --- NEW CREATE RETURN MODAL ---

interface ReturnItemSelection {
    itemId: string;
    quantity: number;
    reason: string;
    condition: string;
}

export const CreateReturnModal = ({
    isOpen,
    onClose,
    customer,
    orders
}: {
    isOpen: boolean,
    onClose: () => void,
    customer?: Customer | null,
    orders: Order[]
}) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedItems, setSelectedItems] = useState<ReturnItemSelection[]>([]);
    const [searchOrder, setSearchOrder] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedOrder(null);
            setSelectedItems([]);
            setSearchOrder('');
        }
    }, [isOpen]);

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        setStep(2);
    };

    const handleItemToggle = (item: OrderLineItem) => {
        if (selectedItems.find(i => i.itemId === item.id)) {
            setSelectedItems(prev => prev.filter(i => i.itemId !== item.id));
        } else {
            setSelectedItems(prev => [...prev, { itemId: item.id, quantity: 1, reason: 'Gefällt nicht', condition: 'Neu' }]);
        }
    };

    const updateItemSelection = (itemId: string, field: keyof ReturnItemSelection, value: any) => {
        setSelectedItems(prev => prev.map(item => item.itemId === itemId ? { ...item, [field]: value } : item));
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
        o.total.toString().includes(searchOrder)
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[650px] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[85vh]" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-white">
                    <div>
                        <div className="flex items-center gap-2 text-gray-900 font-bold text-lg mb-1">
                            <Box className="w-5 h-5" />
                            Neue Retoure erstellen
                        </div>
                        <p className="text-xs text-gray-500">Erstellen Sie eine neue Retoure für einen Kunden - automatisch über Bestellnummer oder manuell</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                {/* Steps Indicator */}
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex gap-4">
                    <div className={`flex items-center gap-2 text-xs font-bold ${step === 1 ? 'text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100' : 'text-gray-400 px-2'}`}>
                        <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        Bestellung
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-bold ${step === 2 ? 'text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100' : 'text-gray-400 px-2'}`}>
                        <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        Produkte
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-bold ${step === 3 ? 'text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100' : 'text-gray-400 px-2'}`}>
                        <div className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        Prüfung
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                    {/* STEP 1: ORDER SELECTION */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* Blue Box Header Area */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                                <div className="bg-blue-600 rounded-lg p-2 text-white shadow-sm">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm mb-1">Bestellung & Kundendaten</h4>
                                    <p className="text-xs text-blue-700">Bestellung suchen oder manuell eingeben</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h5 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <User className="w-3.5 h-3.5" /> Kundendaten
                                </h5>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">E-Mail-Adresse *</label>
                                        <input
                                            type="email"
                                            readOnly
                                            value={customer?.email || ''}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed font-medium border-blue-200 bg-blue-50/20 text-blue-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Kundenname (optional)</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${customer?.firstName || ''} ${customer?.lastName || ''}`}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <h5 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <Search className="w-3.5 h-3.5" /> Bestellung suchen
                                </h5>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Bestellnummer</label>
                                    <input
                                        type="text"
                                        placeholder="#1001 oder 1001"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-300"
                                        value={searchOrder}
                                        onChange={(e) => setSearchOrder(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 bg-[#8b8df7] hover:bg-[#7a7ce6] text-white font-bold text-sm py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2">
                                        <Search className="w-4 h-4" /> Bestellung suchen
                                    </button>
                                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-sm py-2.5 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                                        <FileText className="w-4 h-4 inline mr-2" /> Manuell eingeben
                                    </button>
                                </div>

                                {/* Order List if available */}
                                {filteredOrders.length > 0 && (
                                    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Gefundene Bestellungen</div>
                                        <div className="divide-y divide-gray-100">
                                            {filteredOrders.map(order => (
                                                <div key={order.id} onClick={() => handleSelectOrder(order)} className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-white border border-gray-200 p-2 rounded-lg">
                                                            <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" className="w-5 h-5" alt="Shopify" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-sm">{order.id}</div>
                                                            <div className="text-xs text-gray-500">{order.date} • {order.items.length} Artikel</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">{order.total.toFixed(2)} €</div>
                                                        <div className="text-xs text-green-600 font-bold">{order.status}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PRODUCT SELECTION */}
                    {step === 2 && selectedOrder && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-900">Produkte auswählen</h4>
                                    <p className="text-xs text-gray-500">Welche Artikel sollen zurückgesendet werden?</p>
                                </div>
                                <div className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{selectedOrder.id}</div>
                            </div>

                            <div className="space-y-3">
                                {selectedOrder.items.map(item => {
                                    const isSelected = selectedItems.find(i => i.itemId === item.id);
                                    return (
                                        <div key={item.id} className={`border rounded-xl p-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`w-5 h-5 rounded border mt-1 flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}
                                                    onClick={() => handleItemToggle(item)}
                                                >
                                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg overflow-hidden shrink-0">
                                                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-gray-900 text-sm truncate">{item.productName}</div>
                                                    <div className="text-xs text-gray-500 mb-2">SKU: {item.sku} • {item.price.toFixed(2)} €</div>

                                                    {isSelected && (
                                                        <div className="grid grid-cols-3 gap-2 mt-3 animate-in fade-in slide-in-from-top-1">
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Menge</label>
                                                                <select
                                                                    className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                                                                    value={isSelected.quantity}
                                                                    onChange={(e) => updateItemSelection(item.id, 'quantity', parseInt(e.target.value))}
                                                                >
                                                                    {[...Array(item.quantity).keys()].map(i => (
                                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Grund</label>
                                                                <select
                                                                    className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                                                                    value={isSelected.reason}
                                                                    onChange={(e) => updateItemSelection(item.id, 'reason', e.target.value)}
                                                                >
                                                                    <option value="Gefällt nicht">Gefällt nicht</option>
                                                                    <option value="Zu klein">Zu klein</option>
                                                                    <option value="Zu groß">Zu groß</option>
                                                                    <option value="Defekt">Defekt</option>
                                                                    <option value="Falscher Artikel">Falscher Artikel</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Zustand</label>
                                                                <select
                                                                    className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                                                                    value={isSelected.condition}
                                                                    onChange={(e) => updateItemSelection(item.id, 'condition', e.target.value)}
                                                                >
                                                                    <option value="Neu">Neu</option>
                                                                    <option value="Geöffnet">Geöffnet</option>
                                                                    <option value="Benutzt">Benutzt</option>
                                                                    <option value="Defekt">Defekt</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: REVIEW */}
                    {step === 3 && selectedOrder && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-4">
                                <div className="bg-green-600 rounded-lg p-2 text-white shadow-sm">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-900 text-sm mb-1">Zusammenfassung</h4>
                                    <p className="text-xs text-green-700">Bitte überprüfen Sie die Angaben bevor Sie die Retoure erstellen.</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">Kunde</span>
                                    <span className="text-sm font-bold text-gray-900">{customer?.firstName} {customer?.lastName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">Bestellung</span>
                                    <span className="text-sm font-bold text-gray-900">{selectedOrder.id}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">Artikelanzahl</span>
                                    <span className="text-sm font-bold text-gray-900">{selectedItems.length} Artikel</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-sm font-bold text-gray-700">Erstattungswert (geschätzt)</span>
                                    <span className="text-lg font-bold text-green-600">
                                        {selectedItems.reduce((acc, item) => {
                                            const originalItem = selectedOrder.items.find(i => i.id === item.itemId);
                                            return acc + (originalItem ? originalItem.price * item.quantity : 0);
                                        }, 0).toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={() => setStep(prev => prev - 1 as any)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Zurück
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(prev => prev + 1 as any)}
                            disabled={step === 2 && selectedItems.length === 0}
                            className="px-6 py-2 bg-[#8b8df7] hover:bg-[#7a7ce6] text-white font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                        >
                            Weiter <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={onClose} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Retoure erstellen
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const OrdersModal = ({ isOpen, onClose, orders, customerEmail }: { isOpen: boolean, onClose: () => void, orders: Order[], customerEmail?: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[600px] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        Bestellungen {orders.length > 0 && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{orders.length}</span>}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto bg-gray-50/50 custom-scrollbar">
                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#95BF47]/10 rounded-lg flex items-center justify-center shadow-sm border border-[#95BF47]/20">
                                                    <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" className="w-6 h-6" alt="Shopify" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{order.id}</div>
                                                    <div className="text-[11px] text-gray-400 font-medium">{order.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">{order.total.toFixed(2)} EUR</div>
                                        </div>
                                        <div className="flex gap-2 mb-4">
                                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-md text-xs font-bold border border-green-100 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Bezahlt
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-md text-xs font-bold border border-green-100 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Versendet
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 space-y-4">
                                        {/* Tracking */}
                                        <div className="bg-[#EFF6FF] border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                                            <div className="p-1.5 bg-blue-100 rounded-full mt-0.5"><Truck className="h-3.5 w-3.5 text-blue-600" /></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-blue-900 font-bold mb-0.5">Sendungsverfolgung</div>
                                                <div className="text-xs text-blue-600 font-medium truncate hover:underline cursor-pointer">{order.trackingNumber}</div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="bg-[#F9FBFC] rounded-xl p-3 border border-gray-50/50">
                                            <div className="text-xs font-bold text-gray-900 mb-3 px-1 flex items-center gap-1.5">
                                                <Package className="h-3.5 w-3.5 text-gray-500" /> Artikel ({order.items.length})
                                            </div>
                                            <div className="space-y-2">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm items-center">
                                                        <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden shrink-0">
                                                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-bold text-gray-900 truncate mb-1">{item.productName}</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 border border-gray-200">{item.quantity}x</span>
                                                                <span className="text-[10px] text-gray-400 line-through decoration-gray-400">{item.originalPrice?.toFixed(2)} EUR</span>
                                                                <span className="text-[10px] text-green-600 font-bold">{item.price.toFixed(2)} EUR</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="bg-[#F9FBFC] rounded-xl p-3 border border-gray-50/50">
                                            <div className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 px-1">
                                                <Receipt className="h-3.5 w-3.5 text-gray-500" /> Bestellübersicht
                                            </div>
                                            <div className="space-y-2 text-xs px-1">
                                                <div className="flex justify-between text-gray-600 font-medium">
                                                    <span>Zwischensumme ({order.items.length})</span>
                                                    <span className="text-gray-900 font-bold">{order.subtotal.toFixed(2)} EUR</span>
                                                </div>
                                                <div className="flex justify-between text-gray-600 font-medium items-center">
                                                    <div className="flex items-center gap-1.5"><TagIcon className="h-3 w-3 text-green-600" /> <span>Rabatt</span> <span className="bg-green-50 text-green-700 px-1.5 rounded-[4px] text-[9px] font-bold border border-green-100">{order.discountCode}</span></div>
                                                    <span className="text-green-600 font-bold">-{order.discount.toFixed(2)} EUR</span>
                                                </div>
                                                <div className="flex justify-between text-gray-600 font-medium">
                                                    <span>Versand</span>
                                                    <span className="text-gray-900 font-bold">{order.shippingCost.toFixed(2)} EUR</span>
                                                </div>
                                                <div className="bg-[#BFDBFE] rounded-lg px-3 py-2 flex justify-between items-center mt-3 border border-blue-200 shadow-sm">
                                                    <span className="font-bold text-gray-900">Gesamtsumme</span>
                                                    <span className="font-bold text-gray-900 text-sm">{order.total.toFixed(2)} EUR</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                                                <MapPin className="h-3.5 w-3.5" /> Lieferadresse
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed shadow-sm">
                                                <p className="font-bold text-gray-900 mb-1">{order.shippingAddress.name}</p>
                                                <p>{order.shippingAddress.street}</p>
                                                <p>{order.shippingAddress.zip} {order.shippingAddress.city}</p>
                                                <p>{order.shippingAddress.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                                <Package className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Keine Bestellungen gefunden</h3>
                            <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed">
                                Für die E-Mail-Adresse <span className="font-medium text-gray-700">{customerEmail}</span> wurden keine Shopify-Bestellungen gefunden.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Bestätigen",
    cancelLabel = "Abbrechen",
    isDestructive = false
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`flex-1 py-2.5 border rounded-lg text-sm font-medium text-white shadow-sm transition-colors ${isDestructive ? 'bg-red-600 border-red-600 hover:bg-red-700' : 'bg-blue-600 border-blue-600 hover:bg-blue-700'}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LinkModal = ({ isOpen, onClose, onInsert }: { isOpen: boolean, onClose: () => void, onInsert: (url: string, title: string, target: string) => void }) => {
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [openInNewTab, setOpenInNewTab] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Link einfügen</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">URL</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Anzeigetext (optional)</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="newTab"
                                checked={openInNewTab}
                                onChange={(e) => setOpenInNewTab(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="newTab" className="text-sm text-gray-700">In neuem Tab öffnen</label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50">Abbrechen</button>
                        <button onClick={() => { onInsert(url, text, openInNewTab ? '_blank' : '_self'); onClose(); setUrl(''); setText(''); }} disabled={!url} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Einfügen</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ConnectGmailModal = ({ isOpen, onClose, onConnect }: { isOpen: boolean, onClose: () => void, onConnect: (email: string) => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <img src="https://cdn.icon-icons.com/icons2/2631/PNG/512/gmail_new_logo_icon_159149.png" className="w-6 h-6" alt="Gmail" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Gmail verbinden</h3>
                    <p className="text-sm text-gray-500 mb-6">Verbinden Sie Ihr Google Konto, um E-Mails direkt aus der App zu senden.</p>

                    <button
                        onClick={() => { onConnect('erkan.ecomm@gmail.com'); onClose(); }} // Mock
                        className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <img src="https://cdn.icon-icons.com/icons2/2631/PNG/512/gmail_new_logo_icon_159149.png" className="w-4 h-4" alt="Gmail" />
                        Mit Google anmelden
                    </button>
                </div>
            </div>
        </div>
    );
};

export const CreateTicketModal = ({ isOpen, onClose, onCreate }: { isOpen: boolean, onClose: () => void, onCreate: (name: string, email: string) => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900">Neues Ticket</h3>
                        <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Name</label>
                            <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" value={name} onChange={e => setName(e.target.value)} autoFocus />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">E-Mail</label>
                            <input type="email" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50">Abbrechen</button>
                        <button onClick={() => { onCreate(name, email); onClose(); setName(''); setEmail(''); }} disabled={!name || !email} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Erstellen</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AddAgentModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (name: string, email: string) => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900">Mitarbeiter hinzufügen</h3>
                        <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Name</label>
                            <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" value={name} onChange={e => setName(e.target.value)} autoFocus />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">E-Mail</label>
                            <input type="email" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50">Abbrechen</button>
                        <button onClick={() => { onAdd(name, email); onClose(); setName(''); setEmail(''); }} disabled={!name || !email} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Hinzufügen</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
