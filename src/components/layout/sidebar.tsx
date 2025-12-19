
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
                    ? "bg-[#F2ECF9] text-[#6024B9] font-medium shadow-sm"
                    : "text-[#1D1C21] hover:bg-gray-100/50 hover:text-gray-900"
            )}
            title={label}
        >
            <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-[#6024B9]")} />
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
        <aside className={cn("w-16 lg:w-20 flex flex-col items-center py-6 z-30 flex-shrink-0 h-screen sticky top-0", className)}>
            <div className="mb-8 flex items-center justify-center w-full px-2">
                <img
                    src="https://recruitee.com/hubfs/raw_assets/public/Tellent_Theme_V3/bright/templates/assets/logo/tellent-logo.svg"
                    alt="Recruitee"
                    className="h-8 w-auto min-w-[32px] object-contain"
                />
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
                <div className="h-px w-8 bg-gray-200/50 mx-auto my-2" />
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
