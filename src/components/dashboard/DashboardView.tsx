
import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    Inbox,
    Bot,
    Send,
    Ticket as TicketIcon,
    FileText,
    Zap,
    Clock,
    CheckCircle2,
    RotateCw,
    Calendar
} from 'lucide-react';
import { Organization } from '../../types';

interface DashboardViewProps {
    onNavigateToInbox?: () => void;
    currentOrg: Organization;
}

const DashboardView = ({ onNavigateToInbox, currentOrg }: DashboardViewProps) => {
    const [timeRange, setTimeRange] = useState('7 Tage');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate data fetching delay
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    // Mock Data matching the screenshot style
    const emailHistoryData = [
        { name: '21.11.', value: 1 },
        { name: '22.11.', value: 0 },
        { name: '23.11.', value: 1 },
        { name: '24.11.', value: 1 },
        { name: '25.11.', value: 1 },
        { name: '26.11.', value: 0 },
        { name: '27.11.', value: 2 },
        { name: '28.11.', value: 0 },
        { name: '01.12.', value: 1 },
        { name: '11.12.', value: 1 },
    ];

    const distributionData = [
        { name: 'Auto Gesendet', value: 63, color: '#818cf8' }, // Indigo-400
        { name: 'Entwürfe', value: 37, color: '#c7d2fe' },      // Indigo-200
    ];

    const StatCard = ({
        title,
        value,
        sub,
        icon: Icon,
        colorClass = "bg-blue-50 text-blue-600"
    }: {
        title: string,
        value: string | number,
        sub: string,
        icon: any,
        colorClass?: string
    }) => (
        <div className="bg-white p-5 rounded-xl border border-gray-200/75 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold tracking-tight text-gray-700">{title}</span>
            </div>
            <div>
                <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">{value}</div>
                <div className="text-xs text-gray-500 font-medium">{sub}</div>
            </div>
        </div>
    );

    const AnalyticsCard = ({ title, value, sub, icon: Icon }: { title: string, value: string, sub: string, icon: any }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200/75 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-50 rounded-md text-gray-500">
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold tracking-tight text-gray-700">{title}</span>
                </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{value}</div>
            <div className="text-xs text-gray-500">{sub}</div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8 h-full">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                            Guten Tag, {currentOrg.name}! <span className="text-3xl animate-wave origin-bottom-right">👋</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Hier ist dein aktueller Überblick</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-xs font-medium text-gray-400 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {currentTime}
                        </div>
                        <button
                            onClick={handleRefresh}
                            className={`text-gray-400 hover:text-gray-600 transition-colors ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
                            title="Aktualisieren"
                            disabled={isRefreshing}
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onNavigateToInbox}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Inbox className="w-4 h-4" />
                            E-Mails
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <div className="bg-white border border-gray-200 p-1 rounded-xl flex shadow-sm items-center">
                        <div className="px-3 py-1.5 flex items-center gap-2 text-gray-500 border-r border-gray-100 mr-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wide">Zeitraum:</span>
                        </div>
                        {['7 Tage', '30 Tage', '90 Tage'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Row: KPI Cards (5 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                    title="Gesamt E-Mails"
                    value="0"
                    sub="Empfangen im Zeitraum"
                    icon={Inbox}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="AI Verarbeitet"
                    value="0"
                    sub="0% Rate"
                    icon={Bot}
                    colorClass="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    title="Auto Gesendet"
                    value="1"
                    sub="0% Rate"
                    icon={Send}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Tickets"
                    value="1"
                    sub="Erstellt im Zeitraum"
                    icon={TicketIcon}
                    colorClass="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Entwürfe"
                    value="0"
                    sub="Bereit zum Senden"
                    icon={FileText}
                    colorClass="bg-orange-50 text-orange-600"
                />
            </div>

            {/* Middle Row: Analytics (Performance Overview) */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold tracking-tight text-gray-900">Analytics</h3>
                    <span className="text-xs text-gray-500 font-normal hidden sm:inline-block">- Detaillierte Performance-Übersicht</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnalyticsCard
                        title="Automatisierung"
                        value="0%"
                        sub="0 von 0 verarbeitet"
                        icon={Zap}
                    />
                    <AnalyticsCard
                        title="Antwortzeit"
                        value="< 2min"
                        sub="Durchschnittliche AI Response"
                        icon={Clock}
                    />
                    <AnalyticsCard
                        title="Versandrate"
                        value="0%"
                        sub="1 automatisch versendet"
                        icon={CheckCircle2}
                    />
                </div>
            </div>

            {/* Bottom Row: Charts (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200/75 shadow-sm min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold tracking-tight text-gray-900">E-Mail Verlauf</h3>
                            <p className="text-xs text-gray-500">Performance über Zeit</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                <span className="text-gray-600">Eingänge</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-200"></div>
                                <span className="text-gray-600">Tickets</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={emailHistoryData} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart Section */}
                <div className="bg-white p-6 rounded-xl border border-gray-200/75 shadow-sm min-h-[400px] flex flex-col">
                    <div className="mb-6">
                        <h3 className="font-bold tracking-tight text-gray-900">Verteilung</h3>
                        <p className="text-xs text-gray-500">E-Mail Verarbeitung</p>
                    </div>
                    <div className="flex-1 relative min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text Trick */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Optional: Add total count or percentage in center if needed */}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-6">
                        {distributionData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{entry.name}</span>
                                    <span className="text-xs font-bold text-gray-700">{entry.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
