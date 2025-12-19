"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardView from '@/components/dashboard/DashboardView';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { INITIAL_ORGANIZATION } from '@/lib/data';

export default function DashboardPage() {
    const router = useRouter();

    return (
        <DashboardShell>
            <DashboardView
                currentOrg={INITIAL_ORGANIZATION}
                onNavigateToInbox={() => router.push('/inbox')}
            />
        </DashboardShell>
    );
}
