import type { CheckInResult } from '@/entities/check-in/@x/offline-check-in';
import { localStore, sha256Hex } from '@/shared/lib';

import { decideOffline } from '../lib/decide';
import type { OfflineManifest, OfflineScanResult, OfflineStatus, OfflineTicket, QueuedScan, SyncConflict } from './types';

// Per event, two local documents: the downloaded ticket list (large, written on download and
// sync) and the queue of offline admissions (small, written on every offline scan). Both record
// the user they belong to; another user's documents on the same device are ignored.

const MANIFEST_PREFIX = 'offline-manifest-';
const QUEUE_PREFIX = 'offline-queue-';

type ManifestDoc = { userId: string; manifest: OfflineManifest };
type QueueDoc = { userId: string; queue: QueuedScan[]; conflicts: SyncConflict[] };
type SyncState = { syncing: boolean; syncError: string | null; lastSyncedAt: string | null };

type EventData = {
  manifest: OfflineManifest | null;
  byHash: Map<string, OfflineTicket>;
  queue: QueuedScan[];
  conflicts: SyncConflict[];
  sync: SyncState;
};

const cache = new Map<string, EventData>();
const statusCache = new Map<string, OfflineStatus>();
const listeners = new Set<() => void>();

const cacheKey = (userId: string, eventId: string) => `${userId}\n${eventId}`;

function indexTickets(manifest: OfflineManifest | null): Map<string, OfflineTicket> {
  return new Map(manifest?.tickets.map((t) => [t.tokenHash, t]));
}

function load(userId: string, eventId: string): EventData {
  const key = cacheKey(userId, eventId);
  const cached = cache.get(key);
  if (cached) return cached;
  const manifestDoc = localStore.read<ManifestDoc>(MANIFEST_PREFIX + eventId);
  const queueDoc = localStore.read<QueueDoc>(QUEUE_PREFIX + eventId);
  const manifest = manifestDoc?.userId === userId ? manifestDoc.manifest : null;
  const ownQueue = queueDoc?.userId === userId ? queueDoc : null;
  const data: EventData = {
    manifest,
    byHash: indexTickets(manifest),
    queue: ownQueue?.queue ?? [],
    conflicts: ownQueue?.conflicts ?? [],
    sync: { syncing: false, syncError: null, lastSyncedAt: null },
  };
  cache.set(key, data);
  return data;
}

function changed(userId: string, eventId: string) {
  statusCache.delete(cacheKey(userId, eventId));
  listeners.forEach((listener) => listener());
}

function saveQueue(userId: string, eventId: string, data: EventData) {
  const doc: QueueDoc = { userId, queue: data.queue, conflicts: data.conflicts };
  localStore.write(QUEUE_PREFIX + eventId, doc);
  changed(userId, eventId);
}

function saveManifest(userId: string, eventId: string, data: EventData) {
  if (data.manifest) localStore.write(MANIFEST_PREFIX + eventId, { userId, manifest: data.manifest } satisfies ManifestDoc);
  changed(userId, eventId);
}

/** Stores a freshly downloaded ticket list. Queued admissions stay queued and still count. */
export function storeOfflineManifest(userId: string, eventId: string, manifest: OfflineManifest) {
  const data = load(userId, eventId);
  data.manifest = manifest;
  data.byHash = indexTickets(manifest);
  saveManifest(userId, eventId, data);
}

/**
 * Checks a scanned code against the downloaded list and queues it when it admits someone.
 * `null` when this device has no ticket list for the event.
 */
export function checkInOffline(userId: string, eventId: string, code: string, scanId: string): CheckInResult | null {
  const data = load(userId, eventId);
  if (!data.manifest) return null;
  const ticket = data.byHash.get(sha256Hex(code));
  const localScan = ticket ? data.queue.find((s) => s.ticketId === ticket.id) : undefined;
  const now = new Date().toISOString();
  const result = decideOffline(code, ticket, localScan, now);
  if (result.result === 'valid' && ticket) {
    data.queue = [...data.queue, { scanId, qrToken: code, scannedAt: now, ticketId: ticket.id }];
    saveQueue(userId, eventId, data);
  }
  return result;
}

/** Whether this device has a downloaded ticket list for the event. */
export function hasOfflineTickets(userId: string, eventId: string): boolean {
  return load(userId, eventId).manifest !== null;
}

export function queuedScans(userId: string, eventId: string): QueuedScan[] {
  return load(userId, eventId).queue;
}

/**
 * Removes synced scans from the queue, keeps the ones the server refused as conflicts, and
 * updates the downloaded tickets with the server's view of them.
 */
export function applySyncResults(userId: string, eventId: string, results: OfflineScanResult[]) {
  const data = load(userId, eventId);
  const byScan = new Map(results.map((r) => [r.scanId, r]));
  const conflicts: SyncConflict[] = [];
  for (const scan of data.queue) {
    const res = byScan.get(scan.scanId);
    if (res && res.result !== 'valid') {
      const name = res.ticket?.attendeeName ?? data.manifest?.tickets.find((t) => t.id === scan.ticketId)?.attendeeName;
      conflicts.push({ ...scan, attendeeName: name ?? '', result: res.result });
    }
  }
  data.queue = data.queue.filter((s) => !byScan.has(s.scanId));
  data.conflicts = [...data.conflicts, ...conflicts];
  if (data.manifest) {
    const fresh = new Map(results.flatMap((r) => (r.ticket ? [[r.ticket.id, r.ticket] as const] : [])));
    data.manifest = {
      ...data.manifest,
      tickets: data.manifest.tickets.map((t) => {
        const update = fresh.get(t.id);
        return update ? { ...t, status: update.status, checkedInAt: update.checkedInAt } : t;
      }),
    };
    data.byHash = indexTickets(data.manifest);
    saveManifest(userId, eventId, data);
  }
  saveQueue(userId, eventId, data);
}

export function dismissConflicts(userId: string, eventId: string) {
  const data = load(userId, eventId);
  data.conflicts = [];
  saveQueue(userId, eventId, data);
}

export function setSyncState(userId: string, eventId: string, sync: Partial<SyncState>) {
  const data = load(userId, eventId);
  data.sync = { ...data.sync, ...sync };
  changed(userId, eventId);
}

/** Offline admissions on this device not yet sent to the server, for any event and user. */
export function unsyncedScanCount(): number {
  return localStore
    .keys(QUEUE_PREFIX)
    .reduce((sum, key) => sum + (localStore.read<QueueDoc>(key)?.queue.length ?? 0), 0);
}

/** Deletes every offline ticket list and queue on this device (on sign-out). */
export function clearOfflineData() {
  [...localStore.keys(MANIFEST_PREFIX), ...localStore.keys(QUEUE_PREFIX)].forEach((key) => localStore.remove(key));
  cache.clear();
  statusCache.clear();
  listeners.forEach((listener) => listener());
}

export function subscribeOffline(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A stable snapshot per event (same object until something changes), for useSyncExternalStore. */
export function offlineStatus(userId: string, eventId: string): OfflineStatus {
  const key = cacheKey(userId, eventId);
  const cached = statusCache.get(key);
  if (cached) return cached;
  const data = load(userId, eventId);
  const status: OfflineStatus = {
    downloadedAt: data.manifest?.generatedAt ?? null,
    ticketCount: data.manifest?.tickets.length ?? 0,
    pending: data.queue.length,
    conflicts: data.conflicts,
    ...data.sync,
  };
  statusCache.set(key, status);
  return status;
}
