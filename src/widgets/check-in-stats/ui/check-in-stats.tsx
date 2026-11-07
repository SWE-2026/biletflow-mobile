import { StyleSheet, View } from 'react-native';

import type { CheckInSummary } from '@/entities/event';
import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';
import { Card, ThemedText } from '@/shared/ui';

/** Registered vs checked-in totals for an event (SRS 4.8). */
export function CheckInStats({ summary }: { summary: CheckInSummary }) {
  const theme = useTheme();
  const percent = summary.registered > 0 ? Math.round((summary.checkedIn / summary.registered) * 100) : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Stat label="Checked in" value={summary.checkedIn} />
        <Stat label="Not yet" value={summary.remaining} />
        <Stat label="Registered" value={summary.registered} />
      </View>
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Checked in"
        accessibilityValue={{ min: 0, max: 100, now: percent, text: `${percent}% checked in` }}
        style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: theme.success }]} />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {percent}% checked in
      </ThemedText>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  stat: {
    flex: 1,
    gap: Spacing.half,
  },
  value: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 700,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
