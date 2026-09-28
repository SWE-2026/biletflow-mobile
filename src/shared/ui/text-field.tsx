import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';

import { ThemedText } from './themed-text';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
};

export function TextField({ label, error, onFocus, onBlur, ...rest }: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? theme.danger : focused ? theme.primary : theme.border;

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        selectionColor={theme.primary}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.backgroundElement, borderColor },
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? <FieldError message={error} /> : null}
    </View>
  );
}

export function FieldError({ message }: { message: string }) {
  return (
    <ThemedText type="small" themeColor="danger" accessibilityLiveRegion="polite">
      {message}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1.5,
    fontSize: 16,
    // Web draws its own focus ring; the border color already shows focus.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
});
