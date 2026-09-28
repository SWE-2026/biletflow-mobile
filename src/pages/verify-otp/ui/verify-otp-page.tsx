import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { VerifyOtpForm } from '@/features/auth-by-email';
import { Spacing } from '@/shared/config';
import { Button, Screen, ThemedText } from '@/shared/ui';

export function VerifyOtpPage() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  if (!email) return <Redirect href="/sign-in" />;

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="subtitle">Check your email</ThemedText>
        <ThemedText themeColor="textSecondary">
          Enter the code we sent to <ThemedText>{email}</ThemedText>
        </ThemedText>
      </View>
      <VerifyOtpForm email={email} />
      <Button
        variant="ghost"
        title="Use a different email"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/sign-in'))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
});
