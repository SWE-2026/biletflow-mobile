import { useCallback, useSyncExternalStore } from 'react';

import { offlineStatus, subscribeOffline } from './offline-store';
import type { OfflineStatus } from './types';

/** Live offline check-in status of an event on this device, for the signed-in user. */
export function useOfflineStatus(userId: string, eventId: string): OfflineStatus {
  const snapshot = useCallback(() => offlineStatus(userId, eventId), [userId, eventId]);
  return useSyncExternalStore(subscribeOffline, snapshot, snapshot);
}
