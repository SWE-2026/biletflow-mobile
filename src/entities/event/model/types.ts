/** Event as returned by the API (biletflow-api/docs/api.md, "Objects"). */
export type Event = {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  imageUrls: string[];
  venueName: string;
  venueAddress: string;
  /** IANA time zone the event is scheduled in. */
  timezone: string;
  visibility: 'public' | 'unlisted' | 'private';
  capacity: number;
  status: 'draft' | 'published' | 'cancelled' | 'suspended';
  phase: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * The current user's role at an event: `owner` (their organizer profile owns it), or an assigned
 * Event Admin `supervisor` or `scanner`.
 */
export type StaffRole = 'owner' | 'supervisor' | 'scanner';

export type CheckInSummary = {
  /** Valid and used tickets. */
  registered: number;
  checkedIn: number;
  remaining: number;
};

export type StaffEventDetails = {
  event: Event;
  role: StaffRole;
  summary: CheckInSummary;
};
