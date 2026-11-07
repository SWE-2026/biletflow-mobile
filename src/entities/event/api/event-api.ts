import { apiRequest } from '@/shared/api';

import type { Event, StaffEventDetails } from '../model/types';

/** Published events the user may check attendees in to. */
export async function fetchStaffEvents(token: string, signal?: AbortSignal): Promise<Event[]> {
  const { events } = await apiRequest<{ events: Event[] }>('/staff/events', { token, signal });
  return events;
}

export function fetchStaffEvent(
  token: string,
  eventId: string,
  signal?: AbortSignal,
): Promise<StaffEventDetails> {
  return apiRequest<StaffEventDetails>(`/staff/events/${encodeURIComponent(eventId)}`, { token, signal });
}
