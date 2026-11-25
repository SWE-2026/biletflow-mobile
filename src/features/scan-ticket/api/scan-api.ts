import type { CheckInResult } from '@/entities/check-in';
import { apiRequest } from '@/shared/api';

/**
 * Validates a scanned QR code and checks the ticket in when it is valid. `scanId` lets the API
 * recognise this scan if it is later replayed from the offline queue.
 */
export function checkInByQrCode(
  token: string,
  eventId: string,
  qrToken: string,
  scanId: string,
  signal?: AbortSignal,
): Promise<CheckInResult> {
  return apiRequest<CheckInResult>(`/staff/events/${encodeURIComponent(eventId)}/check-in`, {
    method: 'POST',
    token,
    body: { qrToken, scanId },
    signal,
  });
}
