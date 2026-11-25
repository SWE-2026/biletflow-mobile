import { useState } from 'react';

import { clearOfflineData, unsyncedScanCount } from '@/entities/offline-check-in';
import { useSession } from '@/entities/session';
import { confirm } from '@/shared/lib';
import { Button } from '@/shared/ui';

/** Signs out and deletes offline ticket lists, so attendee data does not stay on a shared phone. */
export function SignOutButton() {
  const { signOut } = useSession();
  const [pending, setPending] = useState(false);

  const handlePress = async () => {
    const unsynced = unsyncedScanCount();
    if (unsynced > 0) {
      const ok = await confirm({
        title: 'Check-ins not synced',
        message: `${unsynced} check-in${unsynced === 1 ? '' : 's'} made offline ${unsynced === 1 ? 'has' : 'have'} not reached the server yet. Signing out deletes ${unsynced === 1 ? 'it' : 'them'}. Open the event while online to sync first.`,
        confirmLabel: 'Sign out anyway',
        destructive: true,
      });
      if (!ok) return;
    }
    setPending(true);
    clearOfflineData();
    signOut();
  };

  return <Button variant="secondary" title="Sign out" loading={pending} onPress={handlePress} />;
}
