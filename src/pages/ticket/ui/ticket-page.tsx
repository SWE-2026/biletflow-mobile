import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { type CheckInResult, CheckInResultCard } from '@/entities/check-in';
import { acceptsCheckIn, canUndoCheckIn, fetchStaffEvent } from '@/entities/event';
import { useAuthToken } from '@/entities/session';
import { fetchStaffTicket, TicketDetails } from '@/entities/ticket';
import { CheckInButton } from '@/features/check-in-attendee';
import { UndoCheckInButton } from '@/features/undo-check-in';
import { errorMessage } from '@/shared/api';
import { MaxContentWidth, Spacing } from '@/shared/config';
import { formatDateTime, useAsyncData } from '@/shared/lib';
import { Card, StateMessage, ThemedText } from '@/shared/ui';

/** One ticket with manual check-in and undo (SRS 4.7, 4.8). */
export function TicketPage() {
  const { eventId, ticketId } = useLocalSearchParams<{ eventId: string; ticketId: string }>();
  const token = useAuthToken();
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { data, error, loading, refreshing, refresh, reload } = useAsyncData(
    `${eventId}/${ticketId}`,
    async (signal) => {
      const [ticket, details] = await Promise.all([
        fetchStaffTicket(token, eventId, ticketId, signal),
        fetchStaffEvent(token, eventId, signal),
      ]);
      return { ticket, details };
    },
  );

  if (loading) return <StateMessage loading />;
  if (!data) {
    return (
      <StateMessage
        title="Could not load the ticket"
        message={errorMessage(error)}
        action={{ label: 'Try again', onPress: reload }}
      />
    );
  }

  const { ticket, details } = data;
  if (!ticket) {
    return <StateMessage title="Ticket not found" message="No ticket with this ID belongs to this event." />;
  }

  const { event, role } = details;
  const open = acceptsCheckIn(event);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      {lastResult ? (
        <CheckInResultCard
          result={lastResult}
          checkedInAtLabel={
            lastResult.ticket?.checkedInAt ? formatDateTime(lastResult.ticket.checkedInAt, event.timezone) : undefined
          }
        />
      ) : null}
      {notice ? (
        <Card>
          <ThemedText type="smallBold">{notice}</ThemedText>
        </Card>
      ) : null}

      <TicketDetails ticket={ticket} timeZone={event.timezone} />

      {!open ? (
        <ThemedText type="small" themeColor="textSecondary">
          Check-in is closed because this event is {event.status}.
        </ThemedText>
      ) : null}

      {open && ticket.status === 'valid' ? (
        <CheckInButton
          eventId={eventId}
          ticketId={ticket.id}
          onCheckedIn={(result) => {
            setNotice(null);
            setLastResult(result);
            reload();
          }}
        />
      ) : null}

      {open && ticket.status === 'used' ? (
        canUndoCheckIn(role) ? (
          <UndoCheckInButton
            eventId={eventId}
            ticket={ticket}
            onUndone={() => {
              setLastResult(null);
              setNotice('Check-in undone. The ticket can be scanned again.');
              reload();
            }}
          />
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Only the organizer or a supervisor can undo a check-in.
          </ThemedText>
        )
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
});
