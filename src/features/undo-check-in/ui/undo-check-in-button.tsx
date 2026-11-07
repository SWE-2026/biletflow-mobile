import { useState } from 'react';
import { View } from 'react-native';

import { useAuthToken } from '@/entities/session';
import type { StaffTicket } from '@/entities/ticket';
import { errorMessage } from '@/shared/api';
import { confirm } from '@/shared/lib';
import { Button, FieldError } from '@/shared/ui';

import { undoCheckIn } from '../api/undo-api';

type UndoCheckInButtonProps = {
  eventId: string;
  ticket: Pick<StaffTicket, 'id' | 'attendeeName'>;
  onUndone: (ticket: StaffTicket) => void;
};

export function UndoCheckInButton({ eventId, ticket, onUndone }: UndoCheckInButtonProps) {
  const token = useAuthToken();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const undo = async () => {
    const confirmed = await confirm({
      title: 'Undo check-in?',
      message: `${ticket.attendeeName || 'This ticket'} will be marked as not checked in, and the ticket can be scanned again.`,
      confirmLabel: 'Undo check-in',
      destructive: true,
    });
    if (!confirmed) return;

    setPending(true);
    setError(null);
    try {
      onUndone(await undoCheckIn(token, eventId, ticket.id));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <Button variant="secondary" title="Undo check-in" onPress={undo} loading={pending} />
      {error ? <FieldError message={error} /> : null}
    </View>
  );
}
