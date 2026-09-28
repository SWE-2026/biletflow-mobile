import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RequestOtpForm } from '@/features/auth-by-email';
import { Spacing } from '@/shared/config';
import { Screen, ThemedText } from '@/shared/ui';

export function SignInPage() {
  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="subtitle">Sign in</ThemedText>
        <ThemedText themeColor="textSecondary">
          Enter your work email and we&apos;ll send you a one-time code.
        </ThemedText>
      </View>
      <RequestOtpForm
        onCodeSent={(email) => router.push({ pathname: '/verify', params: { email } })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
});
