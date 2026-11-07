import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/lib';
import { Card, ThemedText } from '@/shared/ui';

import { formatEventSchedule } from '../lib/format';
import type { Event } from '../model/types';
import { EventPhaseBadge } from './event-phase-badge';

type EventCardProps = {
  event: Event;
  onPress: () => void;
};

export function EventCard({ event, onPress }: EventCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens check-in for this event"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card style={[styles.outlined, { borderColor: theme.border, backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <ThemedText type="smallBold" style={styles.title} numberOfLines={2}>
            {event.title}
          </ThemedText>
          <EventPhaseBadge phase={event.phase} />
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {formatEventSchedule(event)}
        </ThemedText>
        {event.venueName ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {event.venueName}
          </ThemedText>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
  },
  outlined: {
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
