
"use client";

import React, { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppShellProps {
    children: ReactNode;
    activePage: string;
    onPageChange: (page: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activePage, onPageChange }) => {
    return (
        <div className="flex h-screen w-full bg-[#FAF9FC] text-gray-900 font-sans overflow-hidden">
            <Sidebar
                activePage={activePage}
                setActivePage={onPageChange}
            />

            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Header />

                <main className="flex-1 overflow-hidden px-6 pb-6 pt-0 relative focus:outline-none">
                    <div className="h-full w-full max-w-[1920px] mx-auto flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
