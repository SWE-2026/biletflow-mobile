import type { StaffTicket } from '@/entities/ticket';
import { apiRequest } from '@/shared/api';

/** Reverses a check-in; the ticket becomes valid again. Owner and supervisors only. */
export async function undoCheckIn(token: string, eventId: string, ticketId: string): Promise<StaffTicket> {
  const { ticket } = await apiRequest<{ ticket: StaffTicket }>(
    `/staff/events/${encodeURIComponent(eventId)}/tickets/${encodeURIComponent(ticketId)}/undo`,
    { method: 'POST', token },
  );
  return ticket;
}
