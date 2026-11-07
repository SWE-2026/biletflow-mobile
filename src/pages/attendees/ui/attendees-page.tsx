import { router, useLocalSearchParams } from 'expo-router';

import { AttendeeList } from '@/widgets/attendee-list';

export function AttendeesPage() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <AttendeeList
      eventId={eventId}
      onSelectTicket={(ticket) =>
        router.push({
          pathname: '/events/[eventId]/attendees/[ticketId]',
          params: { eventId, ticketId: ticket.id },
        })
      }
    />
  );
}
