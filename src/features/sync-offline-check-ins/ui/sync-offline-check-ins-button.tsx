import { syncOfflineCheckIns } from '@/entities/offline-check-in';
import { useSession } from '@/entities/session';
import { Button } from '@/shared/ui';

type SyncOfflineCheckInsButtonProps = {
  eventId: string;
  syncing: boolean;
};

/** Sends the check-ins this device made offline to the server now. Errors show in the status. */
export function SyncOfflineCheckInsButton({ eventId, syncing }: SyncOfflineCheckInsButtonProps) {
  const { session } = useSession();

  return (
    <Button
      title="Sync now"
      loading={syncing}
      onPress={() => {
        if (session) void syncOfflineCheckIns(session.token, session.user.id, eventId);
      }}
    />
  );
}
