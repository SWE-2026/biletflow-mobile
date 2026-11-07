import type { CheckInResult } from '@/entities/check-in';
import { apiRequest } from '@/shared/api';

/** Validates a scanned QR code and checks the ticket in when it is valid. */
export function checkInByQrCode(token: string, eventId: string, qrToken: string): Promise<CheckInResult> {
  return apiRequest<CheckInResult>(`/staff/events/${encodeURIComponent(eventId)}/check-in`, {
    method: 'POST',
    token,
    body: { qrToken },
  });
}
