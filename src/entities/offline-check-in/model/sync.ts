import { errorMessage } from '@/shared/api';

import { postOfflineScans, SYNC_BATCH_SIZE } from '../api/offline-api';
import { applySyncResults, queuedScans, setSyncState } from './offline-store';

const inFlight = new Map<string, Promise<void>>();

/**
 * Sends this device's offline admissions for the event to the server, in batches, until the queue
 * is empty. Concurrent calls share one run. Never throws: failures end up in the status's
 * `syncError` and the scans stay queued, so a later call retries them (scan IDs make that safe).
 */
export function syncOfflineCheckIns(token: string, userId: string, eventId: string): Promise<void> {
  const key = `${userId}\n${eventId}`;
  const running = inFlight.get(key);
  if (running) return running;
  const run = (async () => {
    setSyncState(userId, eventId, { syncing: true, syncError: null });
    try {
      for (let batch = queuedScans(userId, eventId); batch.length > 0; ) {
        const results = await postOfflineScans(token, eventId, batch.slice(0, SYNC_BATCH_SIZE));
        applySyncResults(userId, eventId, results);
        const next = queuedScans(userId, eventId);
        // Stop if the server answered none of the scans sent, rather than resend them forever.
        if (next.length >= batch.length) break;
        batch = next;
      }
      setSyncState(userId, eventId, { syncing: false, lastSyncedAt: new Date().toISOString() });
    } catch (error) {
      setSyncState(userId, eventId, { syncing: false, syncError: errorMessage(error) });
    } finally {
      inFlight.delete(key);
    }
  })();
  inFlight.set(key, run);
  return run;
}
