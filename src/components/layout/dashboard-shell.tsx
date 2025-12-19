
"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/cn';

import { useTheme } from '@/context/theme-context';

interface DashboardShellProps {
    children: ReactNode;
    className?: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children, className }) => {
    const { borderWidth, borderColor } = useTheme();

    return (
        <div
            className={cn(
                "bg-white rounded-[32px] shadow-sm overflow-hidden flex flex-col h-full transition-all duration-200",
                className
            )}
            style={{
                borderWidth: `${borderWidth}px`,
                borderColor: borderColor,
                borderStyle: 'solid'
            }}
        >
            {children}
        </div>
    );
};
