import { StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';

export function Card({ style, ...rest }: ViewProps) {
  const theme = useTheme();

  return <View style={[styles.card, { backgroundColor: theme.backgroundElement }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
});
