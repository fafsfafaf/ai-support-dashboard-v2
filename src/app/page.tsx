
"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import InboxView from '@/components/inbox/inbox-view';
import { PlaceholderView } from '@/components/placeholder-view';
import DashboardView from '@/components/dashboard/DashboardView';
import { SettingsView } from '@/components/settings/SettingsView';
import { ORGANIZATIONS } from '@/lib/data';

export default function Home() {
  const [activePage, setActivePage] = useState('Inbox');
  const currentOrg = ORGANIZATIONS[0]; // Use first org as default

  const renderContent = () => {
    switch (activePage) {
      case 'Inbox':
        return <InboxView />;
      case 'Dashboard':
        return <DashboardView onNavigateToInbox={() => setActivePage('Inbox')} currentOrg={currentOrg} />;
      case 'Knowledge':
        return <PlaceholderView title="Knowledge Base" />;
      case 'Organisation':
      case 'Team':
      case 'Einstellungen':
      case 'AI Agents':
      case 'Integrationen':
        return <SettingsView activePage={activePage} onNavigate={setActivePage} currentOrg={currentOrg} />;
      default:
        return <InboxView />;
    }
  };

  return (
    <AppShell activePage={activePage} onPageChange={setActivePage}>
      {renderContent()}
    </AppShell>
  );
}
