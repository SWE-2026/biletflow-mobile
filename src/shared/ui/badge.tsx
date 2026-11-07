import { StyleSheet, View } from 'react-native';

import { Spacing, type ThemeColor } from '@/shared/config';
import { useTheme } from '@/shared/lib';

import { ThemedText } from './themed-text';

/** Small status pill. The label always carries the meaning; color only reinforces it. */
export function Badge({ label, color = 'textSecondary' }: { label: string; color?: ThemeColor }) {
  const theme = useTheme();

  return (
    <View style={[styles.badge, { borderColor: theme[color] }]}>
      <ThemedText type="smallBold" style={[styles.label, { color: theme[color] }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});
