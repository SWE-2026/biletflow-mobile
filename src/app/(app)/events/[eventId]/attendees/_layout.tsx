import { router, Stack } from 'expo-router';

import { HeaderButton } from '@/shared/ui';

export default function AttendeesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Attendees',
          headerLeft: () => <HeaderButton label="‹ Events" onPress={() => router.dismissTo('/')} />,
        }}
      />
      <Stack.Screen name="[ticketId]" options={{ title: 'Ticket' }} />
    </Stack>
  );
}
