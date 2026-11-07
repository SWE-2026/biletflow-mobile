import { useState } from 'react';
import { View } from 'react-native';

import type { CheckInResult } from '@/entities/check-in';
import { useAuthToken } from '@/entities/session';
import { errorMessage } from '@/shared/api';
import { Button, FieldError } from '@/shared/ui';

import { checkInTicket } from '../api/check-in-api';

type CheckInButtonProps = {
  eventId: string;
  ticketId: string;
  onCheckedIn: (result: CheckInResult) => void;
};

export function CheckInButton({ eventId, ticketId, onCheckedIn }: CheckInButtonProps) {
  const token = useAuthToken();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkIn = async () => {
    setPending(true);
    setError(null);
    try {
      onCheckedIn(await checkInTicket(token, eventId, ticketId));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <Button title="Check in" onPress={checkIn} loading={pending} />
      {error ? <FieldError message={error} /> : null}
    </View>
  );
}
