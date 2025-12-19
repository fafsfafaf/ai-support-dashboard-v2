
import React from 'react';
import {
    Inbox,
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    Layers,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface SidebarProps {
    activePage?: string;
    setActivePage?: (page: string) => void;
    className?: string;
}

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick: () => void;
    badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick, badge }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative flex items-center justify-center lg:justify-start w-full p-3 rounded-xl transition-all duration-200 mb-1",
                isActive
                    ? "bg-[hsl(264,67%,43%)]/10 text-[hsl(264,67%,43%)] font-medium"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
            title={label}
        >
            <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-[hsl(264,67%,43%)]")} />
        </button>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ activePage = 'Inbox', setActivePage = () => { }, className }) => {
    const navItems = [
        { id: 'Inbox', label: 'Inbox', icon: Inbox, badge: 12 },
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'Knowledge', label: 'Knowledge Base', icon: BookOpen },
        { id: 'Organisation', label: 'Organizations', icon: Layers },
        { id: 'Team', label: 'Team', icon: Users },
    ];

    return (
        <aside className={cn("w-16 lg:w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-30 flex-shrink-0 h-screen sticky top-0", className)}>
            <div className="mb-8">
                <div className="h-10 w-10 bg-[hsl(264,67%,43%)] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[hsl(264,67%,43%)]/20">
                    R
                </div>
            </div>

            <nav className="flex-1 w-full px-2 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activePage === item.id}
                        onClick={() => setActivePage(item.id)}
                        badge={item.badge}
                    />
                ))}
            </nav>

            <div className="mt-auto px-2 flex flex-col gap-2 w-full">
                <NavItem
                    icon={Settings}
                    label="Settings"
                    isActive={activePage === 'Einstellungen'}
                    onClick={() => setActivePage('Einstellungen')}
                />
                <div className="h-px w-8 bg-gray-200 mx-auto my-2" />
                <NavItem
                    icon={LogOut}
                    label="Logout"
                    isActive={false}
                    onClick={() => { }}
                />
            </div>
        </aside>
    );
};
