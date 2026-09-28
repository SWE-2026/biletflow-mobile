import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function TicketScreen() {
  const { eventId, ticketId } = useLocalSearchParams<{ eventId: string; ticketId: string }>();

  return (
    <PlaceholderScreen
      title="Ticket details"
      description={`Status, seat, manual check-in and undo check-in (SRS 4.7, 4.8). Event: ${eventId}, ticket: ${ticketId}`}
    />
  );
}
