import { useLocalSearchParams } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  acceptsCheckIn,
  EventPhaseBadge,
  fetchStaffEvent,
  formatEventSchedule,
  roleLabel,
} from '@/entities/event';
import { useAuthToken } from '@/entities/session';
import { CheckInStats } from '@/widgets/check-in-stats';
import { errorMessage } from '@/shared/api';
import { MaxContentWidth, Spacing } from '@/shared/config';
import { useAsyncData, useRefreshOnFocus, useTheme } from '@/shared/lib';
import { Badge, Card, StateMessage, ThemedText } from '@/shared/ui';

/** Totals refresh this often while the screen is open, so several scanners stay in sync. */
const POLL_INTERVAL_MS = 15_000;

export function EventOverviewPage() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const token = useAuthToken();
  const { data, error, loading, refreshing, refresh, reload } = useAsyncData(eventId, (signal) =>
    fetchStaffEvent(token, eventId, signal),
  );
  useRefreshOnFocus(reload, POLL_INTERVAL_MS);

  if (loading) return <StateMessage loading />;
  if (!data) {
    return (
      <StateMessage
        title="Could not load the event"
        message={errorMessage(error)}
        action={{ label: 'Try again', onPress: reload }}
      />
    );
  }

  const { event, role, summary } = data;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          {event.title}
        </ThemedText>
        <View style={styles.badges}>
          <EventPhaseBadge phase={event.phase} />
          <Badge label={`You: ${roleLabel(role)}`} />
        </View>
      </View>

      {acceptsCheckIn(event) ? null : (
        <Card>
          <ThemedText type="smallBold" themeColor="warning">
            Check-in is closed
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            This event is {event.status}. Tickets can be looked up but not checked in.
          </ThemedText>
        </Card>
      )}

      <Section title="Check-in progress">
        <CheckInStats summary={summary} />
      </Section>

      <Section title="Event details">
        <Card style={styles.details}>
          <DetailRow
            icon={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
            label="When" value={formatEventSchedule(event)} />
          {event.venueName ? (
            <DetailRow
              icon={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
              label="Where" value={event.venueName} secondary={event.venueAddress} />
          ) : null}
        </Card>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

type DetailRowProps = {
  icon: SymbolViewProps['name'];
  label: string;
  value: string;
  secondary?: string;
};

function DetailRow({ icon, label, value, secondary }: DetailRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.detailRow}>
      <SymbolView name={icon} size={20} tintColor={theme.primary} style={styles.detailIcon} />
      <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
        {label}
      </ThemedText>
      <View style={styles.detailValue}>
        <ThemedText type="small">{value}</ThemedText>
        {secondary ? (
          <ThemedText type="small" themeColor="textSecondary">
            {secondary}
          </ThemedText>
        ) : null}
      </View>
    </View>
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
  header: {
    gap: Spacing.three,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  details: {
    gap: Spacing.three,
  },
  detailRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  detailIcon: {
    marginTop: Spacing.half,
  },
  detailLabel: {
    width: 56,
  },
  detailValue: {
    flex: 1,
    gap: Spacing.half,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
