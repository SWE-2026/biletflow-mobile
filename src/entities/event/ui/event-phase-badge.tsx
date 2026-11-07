import type { ThemeColor } from '@/shared/config';
import { Badge } from '@/shared/ui';

import type { Event } from '../model/types';

const phases: Record<Event['phase'], { label: string; color: ThemeColor }> = {
  upcoming: { label: 'Upcoming', color: 'primary' },
  active: { label: 'Happening now', color: 'success' },
  completed: { label: 'Ended', color: 'textSecondary' },
  cancelled: { label: 'Cancelled', color: 'danger' },
};

export function EventPhaseBadge({ phase }: { phase: Event['phase'] }) {
  const { label, color } = phases[phase];
  return <Badge label={label} color={color} />;
}
