import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { SessionProvider, useSession } from '@/entities/session';
import { AnimatedSplashOverlay } from '@/shared/ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { status } = useSession();
  const isSignedIn = status === 'signed-in';

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      {/* Keep the native splash up until the stored session has been restored. */}
      {status !== 'loading' && <AnimatedSplashOverlay />}
    </>
  );
}
