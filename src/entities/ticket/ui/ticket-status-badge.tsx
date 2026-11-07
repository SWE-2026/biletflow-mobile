import { Badge } from '@/shared/ui';

import { ticketStatusInfo } from '../lib/status';
import type { TicketStatus } from '../model/types';

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { label, color } = ticketStatusInfo(status);
  return <Badge label={label} color={color} />;
}
