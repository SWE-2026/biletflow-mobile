import { router, Stack } from 'expo-router';

import { HeaderIconButton } from '@/shared/ui';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My events',
          headerRight: () => (
            <HeaderIconButton
              icon={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
              label="Profile"
              onPress={() => router.push('/profile')}
            />
          ),
        }}
      />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="events/[eventId]" options={{ headerShown: false }} />
      <Stack.Screen
        name="scan-result"
        options={{ title: 'Scan result', presentation: 'formSheet', sheetGrabberVisible: true }}
      />
    </Stack>
  );
}
