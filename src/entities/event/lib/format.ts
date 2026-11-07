import { formatDate, formatDateTime, formatTime } from '@/shared/lib';

import type { Event } from '../model/types';

/** Start and end in the event's own time zone, e.g. "12 Nov 2026, 19:00 – 22:00". */
export function formatEventSchedule(event: Pick<Event, 'startsAt' | 'endsAt' | 'timezone'>): string {
  const start = formatDateTime(event.startsAt, event.timezone);
  const sameDay = formatDate(event.startsAt, event.timezone) === formatDate(event.endsAt, event.timezone);
  const end = sameDay ? formatTime(event.endsAt, event.timezone) : formatDateTime(event.endsAt, event.timezone);
  return end ? `${start} – ${end}` : start;
}
