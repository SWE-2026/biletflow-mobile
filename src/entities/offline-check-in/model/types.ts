import type { CheckInOutcome, CheckInResult } from '@/entities/check-in/@x/offline-check-in';
import type { StaffTicket } from '@/entities/ticket/@x/offline-check-in';

/** A StaffTicket with the SHA-256 (lowercase hex) of its QR token; the token itself is never sent. */
export type OfflineTicket = StaffTicket & { tokenHash: string };

/** Every ticket of an event, downloaded before going offline (OfflineManifest in docs/api.md). */
export type OfflineManifest = {
  generatedAt: string;
  tickets: OfflineTicket[];
};

/** A ticket admitted offline and not yet confirmed by the server. */
export type QueuedScan = {
  scanId: string;
  qrToken: string;
  /** ISO time the ticket was admitted on this device. */
  scannedAt: string;
  ticketId: string;
};

/** A ticket this device admitted offline that the server did not accept, usually a duplicate. */
export type SyncConflict = {
  scanId: string;
  ticketId: string;
  attendeeName: string;
  result: CheckInOutcome;
  scannedAt: string;
};

/** The server's outcome for one queued scan. */
export type OfflineScanResult = CheckInResult & { scanId: string };

/** What the scanner shows about offline check-in for one event. */
export type OfflineStatus = {
  /** When the ticket list was downloaded; `null` when this device has none for the event. */
  downloadedAt: string | null;
  ticketCount: number;
  pending: number;
  conflicts: SyncConflict[];
  syncing: boolean;
  syncError: string | null;
  lastSyncedAt: string | null;
};
