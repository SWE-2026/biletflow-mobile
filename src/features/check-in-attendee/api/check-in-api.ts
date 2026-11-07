import type { CheckInResult } from '@/entities/check-in';
import { apiRequest } from '@/shared/api';

/** Manual check-in by ticket ID, e.g. when the QR code cannot be scanned. */
export function checkInTicket(token: string, eventId: string, ticketId: string): Promise<CheckInResult> {
  return apiRequest<CheckInResult>(
    `/staff/events/${encodeURIComponent(eventId)}/tickets/${encodeURIComponent(ticketId)}/check-in`,
    { method: 'POST', token },
  );
}
