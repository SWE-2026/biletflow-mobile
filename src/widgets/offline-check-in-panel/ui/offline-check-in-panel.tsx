import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { outcomeInfo } from '@/entities/check-in';
import {
  dismissConflicts,
  queuedScans,
  syncOfflineCheckIns,
  useOfflineStatus,
  type SyncConflict,
} from '@/entities/offline-check-in';
import { useSession } from '@/entities/session';
import { DownloadOfflineTicketsButton } from '@/features/download-offline-tickets';
import { SyncOfflineCheckInsButton } from '@/features/sync-offline-check-ins';
import { Spacing } from '@/shared/config';
import { formatDateTime, useRefreshOnFocus } from '@/shared/lib';
import { Button, Card, ThemedText } from '@/shared/ui';

/** Queued offline check-ins are retried this often while the event screen is open. */
const AUTO_SYNC_INTERVAL_MS = 15_000;

type OfflineCheckInPanelProps = {
  eventId: string;
  timeZone?: string;
};

/**
 * Offline check-in for one event (SRS bonus): download the ticket list, see what is waiting to
 * sync, and review scans the server refused. Queued scans sync on their own while it is shown.
 */
export function OfflineCheckInPanel({ eventId, timeZone }: OfflineCheckInPanelProps) {
  const { session } = useSession();
  const userId = session?.user.id ?? '';
  const status = useOfflineStatus(userId, eventId);

  const autoSync = useCallback(() => {
    if (session && queuedScans(session.user.id, eventId).length > 0) {
      void syncOfflineCheckIns(session.token, session.user.id, eventId);
    }
  }, [session, eventId]);
  useEffect(autoSync, [autoSync]);
  useRefreshOnFocus(autoSync, AUTO_SYNC_INTERVAL_MS);

  return (
    <Card style={styles.card}>
      {status.downloadedAt ? (
        <ThemedText type="small" themeColor="textSecondary">
          {status.ticketCount} tickets saved on this phone ({formatDateTime(status.downloadedAt, timeZone)}). If
          the connection drops, scans are checked against this list. Tickets bought later are not in it.
        </ThemedText>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          Download the ticket list before doors open. If the connection drops, scans are then checked on this
          phone and synced when it is back.
        </ThemedText>
      )}
      <DownloadOfflineTicketsButton eventId={eventId} downloaded={status.downloadedAt !== null} />

      {status.pending > 0 ? (
        <View style={styles.block}>
          <ThemedText type="smallBold" themeColor="warning">
            {status.pending} offline check-in{status.pending === 1 ? '' : 's'} waiting to sync
          </ThemedText>
          {status.syncError ? (
            <ThemedText type="small" themeColor="danger">
              Last try failed: {status.syncError}
            </ThemedText>
          ) : null}
          <SyncOfflineCheckInsButton eventId={eventId} syncing={status.syncing} />
        </View>
      ) : status.lastSyncedAt ? (
        <ThemedText type="small" themeColor="success">
          All offline check-ins are synced.
        </ThemedText>
      ) : null}

      {status.conflicts.length > 0 ? (
        <ConflictList
          conflicts={status.conflicts}
          timeZone={timeZone}
          onDismiss={() => dismissConflicts(userId, eventId)}
        />
      ) : null}
    </Card>
  );
}

type ConflictListProps = {
  conflicts: SyncConflict[];
  timeZone?: string;
  onDismiss: () => void;
};

function ConflictList({ conflicts, timeZone, onDismiss }: ConflictListProps) {
  return (
    <View style={styles.block} accessibilityLiveRegion="polite">
      <ThemedText type="smallBold" themeColor="danger">
        {conflicts.length} offline check-in{conflicts.length === 1 ? ' was' : 's were'} refused on sync
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        These people were let in while offline, but the server says the ticket was not valid then, usually
        because another device checked it in first.
      </ThemedText>
      {conflicts.map((c) => (
        <ThemedText key={c.scanId} type="small">
          {c.attendeeName || 'Unknown attendee'}: {outcomeInfo(c.result).title} (scanned{' '}
          {formatDateTime(c.scannedAt, timeZone)})
        </ThemedText>
      ))}
      <Button variant="ghost" title="Dismiss" onPress={onDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  block: {
    gap: Spacing.two,
  },
});
