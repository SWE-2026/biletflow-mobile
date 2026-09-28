import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/shared/ui';

export default function EventOverviewScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <PlaceholderScreen
      title="Event overview"
      description={`Registered vs checked-in totals (SRS 4.8). Event: ${eventId}`}
      links={[{ label: 'All events', href: '/' }]}
    />
  );
}
