
import React from 'react';
import { cn } from '@/lib/cn';

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500", className)}>
            {children}
        </div>
    );
};

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ active, className, children, ...props }) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                active
                    ? "bg-white text-gray-900 shadow-sm"
                    : "hover:bg-gray-200/50 hover:text-gray-900",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
