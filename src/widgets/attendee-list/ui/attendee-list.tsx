import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import type { StaffTicket } from '@/entities/ticket';
import { TicketRow } from '@/entities/ticket';
import { AttendeeSearchField, useAttendeeSearch } from '@/features/search-attendees';
import { errorMessage } from '@/shared/api';
import { Spacing } from '@/shared/config';
import { useRefreshOnFocus } from '@/shared/lib';
import { StateMessage, ThemedText } from '@/shared/ui';

type AttendeeListProps = {
  eventId: string;
  onSelectTicket: (ticket: StaffTicket) => void;
};

/** Searchable list of an event's tickets for manual lookup (SRS 4.8). */
export function AttendeeList({ eventId, onSelectTicket }: AttendeeListProps) {
  const { query, setQuery, searching, data, error, loading, refreshing, refresh, reload } =
    useAttendeeSearch(eventId);
  // Check-ins made on other devices or screens show up when returning to the list.
  useRefreshOnFocus(reload);

  const empty = () => {
    if (loading) return <StateMessage loading />;
    if (error) {
      return (
        <StateMessage
          title="Could not load attendees"
          message={errorMessage(error)}
          action={{ label: 'Try again', onPress: reload }}
        />
      );
    }
    return (
      <StateMessage
        title={query.trim() ? 'No matches' : 'No tickets yet'}
        message={query.trim() ? 'Try a different name, email or the full ticket ID.' : undefined}
      />
    );
  };

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(ticket) => ticket.id}
      renderItem={({ item }) => <TicketRow ticket={item} onPress={() => onSelectTicket(item)} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <AttendeeSearchField value={query} onChangeText={setQuery} />
          {data && data.length >= 50 ? (
            <ThemedText type="small" themeColor="textSecondary">
              Showing the first 50 matches. Refine the search to find someone else.
            </ThemedText>
          ) : null}
          {searching ? (
            <ThemedText type="small" themeColor="textSecondary">
              Searching…
            </ThemedText>
          ) : null}
        </View>
      }
      ListEmptyComponent={empty}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    padding: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  content: {
    flexGrow: 1,
  },
});
