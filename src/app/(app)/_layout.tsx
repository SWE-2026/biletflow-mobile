import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'My events' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="events/[eventId]" options={{ headerShown: false }} />
      <Stack.Screen
        name="scan-result"
        options={{ title: 'Scan result', presentation: 'formSheet', sheetGrabberVisible: true }}
      />
    </Stack>
  );
}
