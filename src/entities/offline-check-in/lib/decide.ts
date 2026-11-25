import type { CheckInResult } from '@/entities/check-in/@x/offline-check-in';

import type { OfflineTicket, QueuedScan } from '../model/types';

/** Campaign QR codes are promo links, never admission tickets (docs/api.md, "Offline check-in"). */
export function isCampaignCode(code: string): boolean {
  return code.includes('campaign=') || code.startsWith('cmp_');
}

/**
 * The offline outcome of a scan, mirroring the server's rules. `ticket` is the downloaded ticket
 * whose token hash matches the code; `localScan` is this device's own earlier offline admission of
 * that ticket. A `valid` result means the caller must queue the scan.
 */
export function decideOffline(
  code: string,
  ticket: OfflineTicket | undefined,
  localScan: QueuedScan | undefined,
  now: string,
): CheckInResult {
  if (isCampaignCode(code)) return { result: 'campaign_qr', ticket: null, offline: true };
  if (!ticket) return { result: 'invalid', ticket: null, offline: true };
  const { tokenHash: _hash, ...staffTicket } = ticket;
  if (localScan) {
    return {
      result: 'already_used',
      ticket: { ...staffTicket, status: 'used', checkedInAt: localScan.scannedAt },
      offline: true,
    };
  }
  switch (ticket.status) {
    case 'valid':
      return { result: 'valid', ticket: { ...staffTicket, status: 'used', checkedInAt: now }, offline: true };
    case 'used':
      return { result: 'already_used', ticket: staffTicket, offline: true };
    default:
      return { result: ticket.status, ticket: staffTicket, offline: true };
  }
}
