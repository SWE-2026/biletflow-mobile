import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { CheckInResultCard, parseCheckInResult } from '@/entities/check-in';
import { canUndoCheckIn, fetchStaffEvent } from '@/entities/event';
import { useAuthToken } from '@/entities/session';
import { UndoCheckInButton } from '@/features/undo-check-in';
import { Spacing } from '@/shared/config';
import { formatDateTime, useAsyncData } from '@/shared/lib';
import { Button, Card, StateMessage, ThemedText } from '@/shared/ui';

/** Outcome of a scan, shown as a sheet over the scanner (SRS 4.8, 4.14). */
export function ScanResultPage() {
  const params = useLocalSearchParams<{ eventId: string; result: string }>();
  const { eventId } = params;
  const result = parseCheckInResult(params.result);
  const token = useAuthToken();
  const [undone, setUndone] = useState(false);
  // For the undo permission and the event's time zone; the result itself is already here.
  const { data: details } = useAsyncData(eventId, (signal) => fetchStaffEvent(token, eventId, signal));

  if (!result) {
    return (
      <StateMessage
        title="Nothing to show"
        message="The scan result is missing. Scan the ticket again."
        action={{ label: 'Back to scanner', onPress: () => router.back() }}
      />
    );
  }

  const { ticket } = result;
  const timeZone = details?.event.timezone;
  const showUndo = result.result === 'valid' && ticket && details && canUndoCheckIn(details.role);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {undone ? (
        <Card>
          <ThemedText type="smallBold">Check-in undone</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {ticket?.attendeeName || 'The ticket'} is no longer checked in. The ticket can be scanned again.
          </ThemedText>
        </Card>
      ) : (
        <CheckInResultCard
          result={result}
          checkedInAtLabel={ticket?.checkedInAt ? formatDateTime(ticket.checkedInAt, timeZone) : undefined}
        />
      )}
      <Button title="Scan next" onPress={() => router.back()} />
      {showUndo && !undone ? (
        <UndoCheckInButton eventId={eventId} ticket={ticket} onUndone={() => setUndone(true)} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
