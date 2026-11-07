function format(iso: string, options: Intl.DateTimeFormatOptions, timeZone?: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(undefined, { ...options, timeZone }).format(date);
  } catch {
    // Unknown time zone: fall back to the device's.
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }
}

/** Date and time, in `timeZone` (IANA) when given, otherwise the device's. */
export function formatDateTime(iso: string, timeZone?: string): string {
  return format(iso, { dateStyle: 'medium', timeStyle: 'short' }, timeZone);
}

export function formatTime(iso: string, timeZone?: string): string {
  return format(iso, { timeStyle: 'short' }, timeZone);
}

export function formatDate(iso: string, timeZone?: string): string {
  return format(iso, { dateStyle: 'medium' }, timeZone);
}
