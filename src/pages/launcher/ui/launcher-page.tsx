import { router } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSession } from '@/entities/session';
import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';
import { Card, Screen, ThemedText } from '@/shared/ui';

export function LauncherPage() {
  const { status } = useSession();

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="subtitle">BiletFlow</ThemedText>
        <ThemedText themeColor="textSecondary">Where do you want to go?</ThemedText>
      </View>
      <View style={styles.tiles}>
        <AppTile
          icon={{ ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' }}
          title="BiletFlow"
          description="Find events, buy tickets and manage your own events."
          onPress={() => router.push('/web')}
        />
        <AppTile
          icon={{ ios: 'qrcode.viewfinder', android: 'qr_code_scanner', web: 'qr_code_scanner' }}
          title="Scanner"
          description="Check in attendees at events you staff."
          onPress={() => router.push(status === 'signed-in' ? '/scanner' : '/scanner/sign-in')}
        />
      </View>
    </Screen>
  );
}

type AppTileProps = {
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
  onPress: () => void;
};

function AppTile({ icon, title, description, onPress }: AppTileProps) {
  const theme = useTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.tile}>
        <SymbolView name={icon} size={32} tintColor={theme.primary} />
        <View style={styles.tileText}>
          <ThemedText type="smallBold" style={styles.tileTitle}>
            {title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        </View>
        <ThemedText themeColor="textSecondary">›</ThemedText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
    paddingTop: Spacing.five,
  },
  tiles: {
    gap: Spacing.three,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  tileText: {
    flex: 1,
    gap: Spacing.one,
  },
  tileTitle: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.7,
  },
});
