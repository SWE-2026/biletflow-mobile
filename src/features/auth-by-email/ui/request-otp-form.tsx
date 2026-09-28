import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/shared/config';
import { Button, TextField } from '@/shared/ui';

import { requestOtp } from '../api/otp-api';
import { errorMessage } from '../model/errors';
import { isValidEmail, normalizeEmail } from '../model/validation';

type RequestOtpFormProps = {
  /** Called with the normalized email once the code has been sent. */
  onCodeSent: (email: string) => void;
};

export function RequestOtpForm({ onCodeSent }: RequestOtpFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const normalized = normalizeEmail(email);
      await requestOtp(normalized);
      onCodeSent(normalized);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError(null);
        }}
        error={error}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
        editable={!submitting}
      />
      <Button
        title="Send code"
        onPress={submit}
        loading={submitting}
        disabled={!email.trim()}
        style={styles.submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.four,
  },
  submit: {
    width: '100%',
    maxWidth: 200,
    alignSelf: 'flex-start',
  },
});
