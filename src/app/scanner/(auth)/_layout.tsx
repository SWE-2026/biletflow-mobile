import { router, Stack } from 'expo-router';

import { HeaderButton } from '@/shared/ui';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerTitle: '', headerShadowVisible: false }}>
      <Stack.Screen
        name="sign-in"
        options={{ headerLeft: () => <HeaderButton label="‹ Apps" onPress={() => router.dismissTo('/')} /> }}
      />
      <Stack.Screen name="verify" options={{ headerBackTitle: 'Back' }} />
    </Stack>
  );
}
