import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';
import { ThemedText } from '@/shared/ui';

import type { StaffTicket } from '../model/types';
import { TicketStatusBadge } from './ticket-status-badge';

type TicketRowProps = {
  ticket: StaffTicket;
  onPress: () => void;
  /** Replaces the ticket type line, e.g. with a check-in time. */
  detail?: ReactNode;
};

export function TicketRow({ ticket, onPress, detail }: TicketRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.border },
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      <View style={styles.text}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {ticket.attendeeName || ticket.attendeeEmail}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {detail ?? `${ticket.ticketTypeName} · ${ticket.attendeeEmail}`}
        </ThemedText>
      </View>
      <TicketStatusBadge status={ticket.status} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
});
