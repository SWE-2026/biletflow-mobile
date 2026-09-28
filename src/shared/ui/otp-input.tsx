import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Fonts, Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';

import { ThemedText } from './themed-text';

type OtpInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  /** Called once all digits are entered. */
  onComplete?: (value: string) => void;
  length?: number;
  error?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
};

/**
 * One-time code input rendered as separate digit cells. A single hidden TextInput
 * receives the keystrokes so paste and SMS/email code autofill keep working.
 */
export function OtpInput({
  value,
  onChangeText,
  onComplete,
  length = 6,
  error = false,
  editable = true,
  autoFocus = true,
}: OtpInputProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(autoFocus);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length);
    onChangeText(digits);
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()} accessible={false}>
      <View style={styles.row}>
        {Array.from({ length }, (_, i) => {
          const isActive = focused && editable && i === Math.min(value.length, length - 1);
          const borderColor = error ? theme.danger : isActive ? theme.primary : theme.border;
          return (
            <View
              key={i}
              style={[styles.cell, { backgroundColor: theme.backgroundElement, borderColor }]}>
              <ThemedText style={styles.digit}>{value[i] ?? ''}</ThemedText>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={length}
        editable={editable}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        caretHidden
        accessibilityLabel={`${length}-digit code`}
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    maxWidth: 52,
    aspectRatio: 0.85,
    borderRadius: Spacing.three,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 600,
    fontFamily: Fonts.mono,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
});
