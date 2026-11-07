import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/shared/config';
import { formatDateTime } from '@/shared/lib';
import { Card, ThemedText } from '@/shared/ui';

import type { StaffTicket } from '../model/types';
import { TicketStatusBadge } from './ticket-status-badge';

type TicketDetailsProps = {
  ticket: StaffTicket;
  /** Event time zone for the check-in time. */
  timeZone?: string;
};

export function TicketDetails({ ticket, timeZone }: TicketDetailsProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.name}>
          {ticket.attendeeName || ticket.attendeeEmail}
        </ThemedText>
        <TicketStatusBadge status={ticket.status} />
      </View>
      <Field label="Email" value={ticket.attendeeEmail} />
      <Field label="Ticket type" value={ticket.ticketTypeName} />
      {ticket.checkedInAt ? (
        <Field label="Checked in" value={formatDateTime(ticket.checkedInAt, timeZone)} />
      ) : null}
      <Field label="Ticket ID" value={ticket.id} mono />
    </Card>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.field}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type={mono ? 'code' : 'small'} selectable>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
  },
  field: {
    gap: Spacing.half,
  },
});
