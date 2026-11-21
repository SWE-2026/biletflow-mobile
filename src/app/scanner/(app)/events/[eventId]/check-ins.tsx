import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/shared/ui';

export default function CheckInsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <PlaceholderScreen
      title="Check-in log"
      description="Recent check-ins and reversals (SRS 4.8). Blocked on the API: there is no staff endpoint that lists an event's check-ins yet."
      links={[
        { label: 'Find an attendee', href: { pathname: '/events/[eventId]/attendees', params: { eventId } } },
      ]}
    />
  );
}
