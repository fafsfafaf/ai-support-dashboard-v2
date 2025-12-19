'use client';

import React, { useState } from 'react';
import {
    UserPlus, Mail, Shield, User, MoreHorizontal, Pencil,
    Trash2, Building2, Check, X, ShieldCheck, UserCheck,
    Plus, ChevronRight, Globe, Save, AlertCircle, RefreshCw
} from 'lucide-react';
import { Badge, Avatar } from '../ui/shared-components';
import { Organization, UserRole } from '../../types';
import { ConfirmationModal } from '../inbox/InboxModals';

interface Member {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'ACTIVE' | 'PENDING';
    joinedAt: string;
}

const INITIAL_MEMBERS: Member[] = [
    { id: 'm1', name: 'Erkan Yusufoglu', email: 'erkan@resolvia.ai', role: 'OWNER', status: 'ACTIVE', joinedAt: '12.01.2023' },
    { id: 'm2', name: 'Sarah Smith', email: 'sarah@resolvia.ai', role: 'ADMIN', status: 'ACTIVE', joinedAt: '01.03.2023' },
    { id: 'm3', name: 'Mike Johnson', email: 'mike@resolvia.ai', role: 'AGENT', status: 'ACTIVE', joinedAt: '20.06.2023' },
    { id: 'm4', name: 'Julia Weber', email: 'julia@resolvia.ai', role: 'AGENT', status: 'PENDING', joinedAt: '15.11.2025' },
];

export const OrganisationView = ({ currentOrg }: { currentOrg: Organization }) => {
    const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
    const [orgName, setOrgName] = useState(currentOrg.name);
    const [isSaving, setIsSaving] = useState(false);

    // Modals
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>('AGENT');

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

    const handleSaveGeneral = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleInvite = () => {
        if (!inviteEmail) return;
        const newMember: Member = {
            id: `m${Date.now()}`,
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: inviteRole,
            status: 'PENDING',
            joinedAt: new Date().toLocaleDateString('de-DE')
        };
        setMembers([...members, newMember]);
        setInviteEmail('');
        setShowInviteModal(false);
    };

    const handleRemoveMember = (member: Member) => {
        setMemberToDelete(member);
        setShowDeleteConfirm(true);
    };

    const executeRemove = () => {
        if (memberToDelete) {
            setMembers(members.filter(m => m.id !== memberToDelete.id));
            setMemberToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const updateRole = (id: string, role: UserRole) => {
        setMembers(members.map(m => m.id === id ? { ...m, role } : m));
    };

    return (
        <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={executeRemove}
                title="Mitglied entfernen?"
                message={`Möchten Sie ${memberToDelete?.name} wirklich aus der Organisation entfernen? Der Zugriff wird sofort entzogen.`}
                confirmLabel="Entfernen"
                isDestructive={true}
            />

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-[450px] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="font-bold text-lg text-gray-900">Teammitglied einladen</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">E-Mail Adresse</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9] font-medium text-gray-900"
                                        placeholder="kollege@firma.de"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rolle</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9] appearance-none"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                                >
                                    <option value="AGENT">Support Agent</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-5 bg-gray-50/50 border-t border-gray-100">
                            <button onClick={() => setShowInviteModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl text-sm hover:bg-gray-50 transition-colors">Abbrechen</button>
                            <button onClick={handleInvite} disabled={!inviteEmail} className="px-5 py-2.5 bg-[#F2ECF9] text-[#6024B9] font-bold rounded-2xl text-sm hover:bg-[#e5ddf3] shadow-sm transition-all active:scale-95 disabled:opacity-50">Einladung senden</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Organisation</h1>
                <p className="text-gray-500 font-medium">Verwalten Sie Ihre Teameinstellungen, Mitglieder und Rollen</p>
            </div>

            {/* Section 1: General Settings */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Allgemeine Einstellungen</h3>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Organisations-Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9] font-bold text-gray-900 transition-all"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Organisations-ID</label>
                                <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-xs font-mono font-bold text-gray-400 cursor-not-allowed">
                                    {currentOrg.id}
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                            <div className={`w-16 h-16 rounded-2xl ${currentOrg.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-4`}>
                                {currentOrg.initials}
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Branding</h4>
                            <p className="text-xs text-gray-500 max-w-[200px]">Diese Ansicht wird im Workspace für alle Mitglieder angezeigt.</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSaveGeneral}
                            className="bg-[#F2ECF9] hover:bg-[#e5ddf3] text-[#6024B9] font-bold text-sm px-6 py-2.5 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
                        >
                            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Änderungen speichern
                        </button>
                    </div>
                </div>
            </div>

            {/* Section 2: Team Members */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Teammitglieder</h3>
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-gray-200 ml-2">{members.length} insgesamt</span>
                    </div>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="bg-white border border-gray-200 text-gray-700 font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Mitglied einladen
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Benutzer</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rolle</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Beigetreten</th>
                                <th className="px-8 py-4 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <Avatar fallback={member.name.substring(0, 2).toUpperCase()} size="md" className="bg-indigo-600 text-white font-bold" />
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{member.name}</div>
                                                <div className="text-xs text-gray-500 font-medium">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {member.status === 'ACTIVE' ? (
                                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-100 uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Aktiv
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-yellow-100 uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div> Ausstehend
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <select
                                            className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer hover:text-[#6024B9] transition-colors disabled:cursor-default disabled:hover:text-gray-700"
                                            value={member.role}
                                            onChange={(e) => updateRole(member.id, e.target.value as UserRole)}
                                            disabled={member.role === 'OWNER'}
                                        >
                                            <option value="AGENT">Support Agent</option>
                                            <option value="ADMIN">Administrator</option>
                                            <option value="OWNER">Eigentümer</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                                        {member.joinedAt}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {member.role !== 'OWNER' && (
                                            <button
                                                onClick={() => handleRemoveMember(member)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                title="Mitglied entfernen"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 bg-gray-50 border border-gray-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Neue Organisation erstellen?</h4>
                            <p className="text-sm text-gray-500 max-w-md">Erstellen Sie einen weiteren Workspace für ein separates Projekt oder eine andere Brand.</p>
                        </div>
                    </div>
                    <button className="whitespace-nowrap bg-gray-900 text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-black shadow-lg transition-all active:scale-95 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Workspace erstellen
                    </button>
                </div>
            </div>

            {/* Role Descriptions */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Eigentümer</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Voller Zugriff auf Abrechnung, Workspace-Löschung und alle Einstellungen.</p>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Administrator</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Kann Mitglieder einladen, Kanäle konfigurieren und AI Agents verwalten.</p>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Support Agent</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Kann Tickets bearbeiten, Kunden antworten und Retouren verwalten.</p>
                </div>
            </div>
        </div>
    );
};
