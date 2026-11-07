import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';
import { ThemedText } from '@/shared/ui';

import { outcomeInfo } from '../model/outcome';
import type { CheckInResult } from '../model/types';

type CheckInResultCardProps = {
  result: CheckInResult;
  /** Formatted check-in time, shown for `already_used`. */
  checkedInAtLabel?: string;
};

/** Large, glanceable outcome of a scan or manual check-in. */
export function CheckInResultCard({ result, checkedInAtLabel }: CheckInResultCardProps) {
  const theme = useTheme();
  const info = outcomeInfo(result.result);
  const color = theme[info.color];
  const { ticket } = result;

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLiveRegion="assertive"
      accessibilityLabel={`${info.title}. ${info.description}${ticket ? ` ${ticket.attendeeName}, ${ticket.ticketTypeName}.` : ''}`}
      style={[styles.card, { borderColor: color, backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.symbol, { backgroundColor: color }]}>
        <ThemedText style={[styles.symbolText, { color: theme.background }]}>{info.symbol}</ThemedText>
      </View>
      <ThemedText type="subtitle" style={[styles.title, { color }]}>
        {info.title}
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.center}>
        {info.description}
      </ThemedText>
      {ticket ? (
        <View style={styles.ticket}>
          <ThemedText type="smallBold" style={[styles.center, styles.name]}>
            {ticket.attendeeName || ticket.attendeeEmail}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
            {ticket.ticketTypeName}
          </ThemedText>
          {result.result === 'already_used' && checkedInAtLabel ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
              Checked in {checkedInAtLabel}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: 3,
  },
  symbol: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: 700,
  },
  title: {
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
  },
  ticket: {
    gap: Spacing.one,
  },
  name: {
    fontSize: 18,
    lineHeight: 24,
  },
});
