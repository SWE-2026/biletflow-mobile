import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import { EventCard, fetchStaffEvents } from '@/entities/event';
import { useAuthToken, useSession } from '@/entities/session';
import { errorMessage } from '@/shared/api';
import { Spacing } from '@/shared/config';
import { useAsyncData, useRefreshOnFocus } from '@/shared/lib';
import { StateMessage } from '@/shared/ui';

/** Published events the signed-in user is assigned to check in (SRS 4.8). */
export function EventsPage() {
  const token = useAuthToken();
  const { session } = useSession();
  const { data, error, loading, refreshing, refresh, reload } = useAsyncData('staff-events', (signal) =>
    fetchStaffEvents(token, signal),
  );
  useRefreshOnFocus(reload);

  const empty = () => {
    if (loading) return <StateMessage loading />;
    if (error) {
      return (
        <StateMessage
          title="Could not load your events"
          message={errorMessage(error)}
          action={{ label: 'Try again', onPress: reload }}
        />
      );
    }
    return (
      <StateMessage
        title="No events assigned"
        message={`Events appear here once an organizer adds ${session?.user.email ?? 'your email'} as an Event Admin. Only published events are listed.`}
      />
    );
  };

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(event) => event.id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={() => router.push({ pathname: '/events/[eventId]', params: { eventId: item.id } })}
        />
      )}
      ListEmptyComponent={empty}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
