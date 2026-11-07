import { useRef, useState } from 'react';

import type { CheckInResult } from '@/entities/check-in';
import { useAuthToken } from '@/entities/session';
import { errorMessage } from '@/shared/api';

import { checkInByQrCode } from '../api/scan-api';

/** The camera reports the same code many times per second; ignore repeats for this long. */
const REPEAT_COOLDOWN_MS = 3000;
/** The API accepts QR tokens up to this length. */
const MAX_CODE_LENGTH = 512;

type UseScanTicketOptions = {
  eventId: string;
  onResult: (result: CheckInResult) => void;
};

/**
 * Turns raw camera reads into check-ins: one request at a time, repeated reads of the same code
 * ignored, and the outcome handed to `onResult`.
 */
export function useScanTicket({ eventId, onResult }: UseScanTicketOptions) {
  const token = useAuthToken();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const last = useRef<{ code: string; at: number } | null>(null);

  const handleScan = async (raw: string) => {
    const code = raw.trim();
    const now = Date.now();
    if (busy.current || !code) return;
    if (last.current?.code === code && now - last.current.at < REPEAT_COOLDOWN_MS) return;
    last.current = { code, at: now };

    if (code.length > MAX_CODE_LENGTH) {
      onResult({ result: 'invalid', ticket: null });
      return;
    }

    busy.current = true;
    setPending(true);
    setError(null);
    try {
      onResult(await checkInByQrCode(token, eventId, code));
    } catch (e) {
      // Allow an immediate retry of the same code after a network error.
      last.current = null;
      setError(errorMessage(e));
    } finally {
      busy.current = false;
      // Restart the cooldown so the code still in front of the camera is not re-read on return.
      if (last.current) last.current = { code, at: Date.now() };
      setPending(false);
    }
  };

  return { handleScan, pending, error, clearError: () => setError(null) };
}
