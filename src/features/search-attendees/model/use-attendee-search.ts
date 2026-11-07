import { useState } from 'react';

import { useAuthToken } from '@/entities/session';
import { searchStaffTickets } from '@/entities/ticket';
import { useAsyncData, useDebouncedValue } from '@/shared/lib';

const DEBOUNCE_MS = 300;
/** The API rejects longer queries. */
export const MAX_QUERY_LENGTH = 100;

/** Attendee search for one event: name, email or exact ticket ID. Empty lists the first 50 by name. */
export function useAttendeeSearch(eventId: string) {
  const token = useAuthToken();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim(), DEBOUNCE_MS);
  const results = useAsyncData(`${eventId}\n${debounced}`, (signal) =>
    searchStaffTickets(token, eventId, debounced, signal),
  );

  return { query, setQuery, searching: query.trim() !== debounced, ...results };
}
