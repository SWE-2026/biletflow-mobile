import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Appearance, useColorScheme } from 'react-native';

import { SessionProvider, useSession } from '@/entities/session';
import { Colors } from '@/shared/config';
import { AnimatedSplashOverlay } from '@/shared/ui';

SplashScreen.preventAutoHideAsync();
// The app is light-only: ignore the phone's dark mode (app.json sets the same for native UI;
// this also covers Expo Go, which doesn't apply that setting).
Appearance.setColorScheme('light');

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
  const palette = Colors[useColorScheme() === 'dark' ? 'dark' : 'light'];

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="web"
          options={{
            headerShown: true,
            title: 'BiletFlow',
            headerBackTitle: 'Apps',
            headerStyle: { backgroundColor: palette.primary },
            headerTintColor: palette.onPrimary,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="scanner" />
      </Stack>
      {/* Keep the native splash up until the stored session has been restored. */}
      {status !== 'loading' && <AnimatedSplashOverlay />}
    </>
  );
}
