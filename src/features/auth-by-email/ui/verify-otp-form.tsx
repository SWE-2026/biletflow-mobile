import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSession } from '@/entities/session';
import { Spacing } from '@/shared/config';
import { Button, FieldError, OtpInput, ThemedText } from '@/shared/ui';

import { isMockAuth, MOCK_OTP_CODE, requestOtp, verifyOtp } from '../api/otp-api';
import { OTP_LENGTH, RESEND_COOLDOWN_SECONDS } from '../config/otp';
import { errorMessage } from '../model/errors';
import { useCountdown } from '../model/use-countdown';

type VerifyOtpFormProps = {
  email: string;
};

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const { signIn } = useSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const cooldown = useCountdown(RESEND_COOLDOWN_SECONDS);

  const verify = async (value: string) => {
    if (verifying || value.length !== OTP_LENGTH) return;
    setError(null);
    setVerifying(true);
    try {
      // On success the root navigator's guard swaps to the signed-in stack.
      await signIn(await verifyOtp(email, value));
    } catch (e) {
      setError(errorMessage(e));
      setCode('');
      setVerifying(false);
    }
  };

  const resend = async () => {
    setError(null);
    setResending(true);
    try {
      await requestOtp(email);
      setCode('');
      cooldown.restart();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <OtpInput
          value={code}
          onChangeText={(value) => {
            setCode(value);
            if (error) setError(null);
          }}
          onComplete={verify}
          length={OTP_LENGTH}
          error={!!error}
          editable={!verifying}
        />
        {error ? <FieldError message={error} /> : null}
        {isMockAuth ? (
          <ThemedText type="small" themeColor="textSecondary">
            Dev mode (no API URL): use code {MOCK_OTP_CODE}.
          </ThemedText>
        ) : null}
      </View>
      <Button
        title="Verify"
        onPress={() => verify(code)}
        loading={verifying}
        disabled={code.length !== OTP_LENGTH}
      />
      <Button
        variant="ghost"
        title={cooldown.remaining > 0 ? `Resend code in ${cooldown.remaining}s` : 'Resend code'}
        onPress={resend}
        loading={resending}
        disabled={cooldown.remaining > 0 || verifying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.two,
  },
});
