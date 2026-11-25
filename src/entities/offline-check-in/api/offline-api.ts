import { apiRequest } from '@/shared/api';

import type { OfflineManifest, OfflineScanResult, QueuedScan } from '../model/types';

/** Scans per sync request; the API accepts up to 200. */
export const SYNC_BATCH_SIZE = 200;

const eventPath = (eventId: string) => `/staff/events/${encodeURIComponent(eventId)}`;

/** Every ticket of the event with its token hash, for checking tickets without a connection. */
export function fetchOfflineManifest(token: string, eventId: string, signal?: AbortSignal): Promise<OfflineManifest> {
  return apiRequest<OfflineManifest>(`${eventPath(eventId)}/offline-manifest`, { token, signal });
}

/** Replays offline admissions; results come back in the same order. */
export async function postOfflineScans(
  token: string,
  eventId: string,
  scans: QueuedScan[],
): Promise<OfflineScanResult[]> {
  const { results } = await apiRequest<{ results: OfflineScanResult[] }>(`${eventPath(eventId)}/offline-check-ins`, {
    method: 'POST',
    token,
    body: { scans: scans.map(({ scanId, qrToken, scannedAt }) => ({ scanId, qrToken, scannedAt })) },
  });
  return results;
}
