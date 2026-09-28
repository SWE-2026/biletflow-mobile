import { Stack } from 'expo-router';

export default function AttendeesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Attendees' }} />
      <Stack.Screen name="[ticketId]" options={{ title: 'Ticket' }} />
    </Stack>
  );
}
