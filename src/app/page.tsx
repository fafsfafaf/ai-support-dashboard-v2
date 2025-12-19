
"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import InboxView from '@/components/inbox/inbox-view';
import { PlaceholderView } from '@/components/placeholder-view';

export default function Home() {
  const [activePage, setActivePage] = useState('Inbox');

  const renderContent = () => {
    switch (activePage) {
      case 'Inbox':
        return <InboxView />;
      case 'Dashboard':
        return <PlaceholderView title="Dashboard" />;
      case 'Knowledge':
        return <PlaceholderView title="Knowledge Base" />;
      case 'Organisation':
        return <PlaceholderView title="Organizations" />;
      case 'Team':
        return <PlaceholderView title="Team Management" />;
      case 'Einstellungen':
        return <PlaceholderView title="Settings" />;
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
