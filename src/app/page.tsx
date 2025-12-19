
import { AppShell } from '@/components/layout/app-shell';
import InboxView from '@/components/inbox/inbox-view';

export default function Home() {
  return (
    <AppShell>
      <InboxView />
    </AppShell>
  );
}
