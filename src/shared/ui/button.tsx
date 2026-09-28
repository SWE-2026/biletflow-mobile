import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';

import { ThemedText } from './themed-text';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const color = variant === 'primary' ? theme.onPrimary : theme.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: theme.primary },
        variant === 'secondary' && { backgroundColor: theme.backgroundElement },
        variant === 'ghost' && styles.ghost,
        (pressed || isDisabled) && styles.dimmed,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <ThemedText type="smallBold" style={[styles.label, { color }]}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    minHeight: 44,
  },
  label: {
    fontSize: 16,
  },
  dimmed: {
    opacity: 0.6,
  },
});
