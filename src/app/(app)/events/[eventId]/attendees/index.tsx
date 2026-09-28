import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function AttendeesScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <PlaceholderScreen
      title="Attendee search"
      description="Manual attendee lookup by name, email or ticket ID (SRS 4.8)."
      links={[{ label: 'Demo ticket', href: `/events/${eventId}/attendees/demo-ticket` }]}
    />
  );
}
