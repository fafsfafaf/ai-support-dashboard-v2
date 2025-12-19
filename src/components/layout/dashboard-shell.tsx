
"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface DashboardShellProps {
    children: ReactNode;
    className?: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "bg-white rounded-[32px] shadow-sm border-[3px] border-[#D8E0E3] overflow-hidden flex flex-col h-full",
            className
        )}>
            {children}
        </div>
    );
};
