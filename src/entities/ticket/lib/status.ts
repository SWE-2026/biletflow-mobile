import type { ThemeColor } from '@/shared/config';

import type { TicketStatus } from '../model/types';

const statuses: Record<TicketStatus, { label: string; color: ThemeColor }> = {
  valid: { label: 'Not checked in', color: 'primary' },
  used: { label: 'Checked in', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
  refunded: { label: 'Refunded', color: 'danger' },
};

export function ticketStatusInfo(status: TicketStatus): { label: string; color: ThemeColor } {
  // Fall back for statuses added to the API later.
  return statuses[status] ?? { label: status, color: 'textSecondary' };
}
