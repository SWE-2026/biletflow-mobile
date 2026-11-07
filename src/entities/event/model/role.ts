import type { Event, StaffRole } from './types';

const roleLabels: Record<StaffRole, string> = {
  owner: 'Organizer',
  supervisor: 'Supervisor',
  scanner: 'Scanner',
};

export function roleLabel(role: StaffRole): string {
  return roleLabels[role];
}

/** Only the owner and supervisors may reverse a check-in; the API returns 403 for scanners. */
export function canUndoCheckIn(role: StaffRole): boolean {
  return role !== 'scanner';
}

/** Check-in and undo need a published event (409 `invalid_event_state` otherwise). */
export function acceptsCheckIn(event: Event): boolean {
  return event.status === 'published';
}
