import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';

import { Button } from './button';
import { ThemedText } from './themed-text';

type StateMessageProps = {
  title?: string;
  message?: string;
  loading?: boolean;
  action?: { label: string; onPress: () => void };
};

/** Centered loading, empty or error state for a screen or list. */
export function StateMessage({ title, message, loading, action }: StateMessageProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator color={theme.textSecondary} /> : null}
      {title ? (
        <ThemedText type="smallBold" style={styles.center}>
          {title}
        </ThemedText>
      ) : null}
      {message ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {message}
        </ThemedText>
      ) : null}
      {action ? <Button variant="secondary" title={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  center: {
    textAlign: 'center',
  },
});
