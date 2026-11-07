import type { CheckInOutcome, CheckInResult } from '../model/types';

const outcomes: readonly CheckInOutcome[] = [
  'valid',
  'already_used',
  'cancelled',
  'refunded',
  'invalid',
  'campaign_qr',
];

/** Encodes a result as a string, e.g. to hand it to another screen as a route param. */
export function serializeCheckInResult(result: CheckInResult): string {
  return JSON.stringify(result);
}

/** Decodes `serializeCheckInResult` output; `null` when the input is missing or malformed. */
export function parseCheckInResult(raw: string | undefined): CheckInResult | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return null;
    const { result, ticket } = value as Partial<CheckInResult>;
    if (!result || !outcomes.includes(result)) return null;
    const validTicket = typeof ticket === 'object' && ticket !== null && typeof ticket.id === 'string';
    return { result, ticket: validTicket ? ticket : null };
  } catch {
    return null;
  }
}
