import type { ThemeColor } from '@/shared/config';

import type { CheckInOutcome } from './types';

export type OutcomeInfo = {
  title: string;
  description: string;
  /** Text mark shown next to the title, so the outcome never depends on color alone. */
  symbol: string;
  color: ThemeColor;
  /** Whether the person may enter now. */
  admit: boolean;
};

const outcomes: Record<CheckInOutcome, OutcomeInfo> = {
  valid: {
    title: 'Valid — admit',
    description: 'Ticket checked in.',
    symbol: '✓',
    color: 'success',
    admit: true,
  },
  already_used: {
    title: 'Already used',
    description: 'This ticket was checked in before. Do not admit again.',
    symbol: '!',
    color: 'warning',
    admit: false,
  },
  cancelled: {
    title: 'Cancelled',
    description: 'This registration was cancelled. The ticket is not valid.',
    symbol: '✕',
    color: 'danger',
    admit: false,
  },
  refunded: {
    title: 'Refunded',
    description: 'This order was refunded. The ticket is not valid.',
    symbol: '✕',
    color: 'danger',
    admit: false,
  },
  invalid: {
    title: 'Invalid ticket',
    description: 'No ticket with this code belongs to this event.',
    symbol: '✕',
    color: 'danger',
    admit: false,
  },
  campaign_qr: {
    title: 'Promo QR code',
    description:
      'This is a Campaign QR code for discounts, not an admission ticket. Ask for the ticket QR code.',
    symbol: '✕',
    color: 'danger',
    admit: false,
  },
};

export function outcomeInfo(outcome: CheckInOutcome): OutcomeInfo {
  return outcomes[outcome] ?? outcomes.invalid;
}
