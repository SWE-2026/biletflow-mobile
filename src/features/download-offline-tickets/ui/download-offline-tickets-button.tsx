import { useState } from 'react';
import { View } from 'react-native';

import { fetchOfflineManifest, storeOfflineManifest } from '@/entities/offline-check-in';
import { useSession } from '@/entities/session';
import { errorMessage } from '@/shared/api';
import { Spacing } from '@/shared/config';
import { Button, FieldError } from '@/shared/ui';

type DownloadOfflineTicketsButtonProps = {
  eventId: string;
  /** Whether a list is already on the device (the button then refreshes it). */
  downloaded: boolean;
};

/** Saves the event's ticket list on the device so tickets can be checked without a connection. */
export function DownloadOfflineTicketsButton({ eventId, downloaded }: DownloadOfflineTicketsButtonProps) {
  const { session } = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async () => {
    if (!session) return;
    setPending(true);
    setError(null);
    try {
      storeOfflineManifest(session.user.id, eventId, await fetchOfflineManifest(session.token, eventId));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={{ gap: Spacing.two }}>
      <Button
        variant={downloaded ? 'secondary' : 'primary'}
        title={downloaded ? 'Refresh ticket list' : 'Download ticket list'}
        onPress={download}
        loading={pending}
      />
      {error ? <FieldError message={error} /> : null}
    </View>
  );
}
