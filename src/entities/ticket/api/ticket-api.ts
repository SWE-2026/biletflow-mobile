import { apiRequest } from '@/shared/api';

import type { StaffTicket } from '../model/types';

/**
 * Searches an event's tickets by attendee name or email, or an exact ticket ID. An empty query
 * lists the first 50 tickets by name. At most 50 results.
 */
export async function searchStaffTickets(
  token: string,
  eventId: string,
  query: string,
  signal?: AbortSignal,
): Promise<StaffTicket[]> {
  const q = encodeURIComponent(query.trim());
  const { tickets } = await apiRequest<{ tickets: StaffTicket[] }>(
    `/staff/events/${encodeURIComponent(eventId)}/attendees?q=${q}`,
    { token, signal },
  );
  return tickets;
}

/** One ticket of the event, or `null`. The API has no single-ticket route; search matches IDs exactly. */
export async function fetchStaffTicket(
  token: string,
  eventId: string,
  ticketId: string,
  signal?: AbortSignal,
): Promise<StaffTicket | null> {
  const tickets = await searchStaffTickets(token, eventId, ticketId, signal);
  return tickets.find((ticket) => ticket.id === ticketId) ?? null;
}
