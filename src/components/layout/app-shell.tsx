
"use client";

import React, { ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppShellProps {
    children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const [activePage, setActivePage] = useState('Inbox');

    return (
        <div className="flex h-screen w-full bg-[#FAF9FC] text-gray-900 font-sans overflow-hidden">
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="flex-1 overflow-auto p-6 relative focus:outline-none">
                    <div className="h-full w-full max-w-[1920px] mx-auto flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
