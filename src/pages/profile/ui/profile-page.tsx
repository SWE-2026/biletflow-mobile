import { StyleSheet, View } from 'react-native';

import { useSession } from '@/entities/session';
import { SignOutButton } from '@/features/sign-out';
import { Spacing } from '@/shared/config';
import { Screen, ThemedText } from '@/shared/ui';

export function ProfilePage() {
  const { session } = useSession();

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="small" themeColor="textSecondary">
          Signed in as
        </ThemedText>
        <ThemedText>{session?.user.email}</ThemedText>
      </View>
      <SignOutButton />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
});
