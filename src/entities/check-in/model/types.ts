import type { StaffTicket } from '@/entities/ticket/@x/check-in';

/** Outcome of a scan or manual check-in. The API answers every scan with 200 and one of these. */
export type CheckInOutcome =
  | 'valid'
  | 'already_used'
  | 'cancelled'
  | 'refunded'
  | 'invalid'
  | 'campaign_qr';

export type CheckInResult = {
  result: CheckInOutcome;
  /** `null` for `invalid` and `campaign_qr`. */
  ticket: StaffTicket | null;
};
