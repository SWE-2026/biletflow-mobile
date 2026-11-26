import { useRef, useState } from 'react';

import type { CheckInResult } from '@/entities/check-in';
import { checkInOffline, hasOfflineTickets, queuedScans, syncOfflineCheckIns } from '@/entities/offline-check-in';
import { useSession } from '@/entities/session';
import { ApiError, errorMessage } from '@/shared/api';
import { randomUuid } from '@/shared/lib';

import { checkInByQrCode } from '../api/scan-api';

/** The camera reports the same code many times per second; ignore repeats for this long. */
const REPEAT_COOLDOWN_MS = 3000;
/** The API accepts QR tokens up to this length. */
const MAX_CODE_LENGTH = 512;
/** With a downloaded ticket list, a scan waits this long for the server before deciding offline. */
const OFFLINE_FALLBACK_MS = 4000;
/** Without one, a scan gives up on the server after this long. */
const ONLINE_TIMEOUT_MS = 20_000;

type UseScanTicketOptions = {
  eventId: string;
  onResult: (result: CheckInResult) => void;
};

/** No answer from the server: no network, a timeout, or a gateway in front of a down API. */
function isConnectivityError(error: unknown): boolean {
  if (error instanceof Error && error.name === 'AbortError') return true;
  return error instanceof ApiError && (error.status === 0 || [502, 503, 504].includes(error.status));
}

/**
 * Online check-in with a time limit; on a connectivity error the scan is decided from the
 * downloaded ticket list instead. Rethrows when there is no list to fall back on.
 */
async function checkIn(token: string, userId: string, eventId: string, code: string): Promise<CheckInResult> {
  const scanId = randomUuid();
  const controller = new AbortController();
  const canFallBack = hasOfflineTickets(userId, eventId);
  const timer = setTimeout(() => controller.abort(), canFallBack ? OFFLINE_FALLBACK_MS : ONLINE_TIMEOUT_MS);
  try {
    const result = await checkInByQrCode(token, eventId, code, scanId, controller.signal);
    // Back online: send anything this device admitted offline.
    if (queuedScans(userId, eventId).length > 0) void syncOfflineCheckIns(token, userId, eventId);
    return result;
  } catch (error) {
    const offline = canFallBack && isConnectivityError(error) ? checkInOffline(userId, eventId, code, scanId) : null;
    if (offline) return offline;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The server did not answer. Check your network, or download the ticket list for offline check-in.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Turns raw camera reads into check-ins: one request at a time, repeated reads of the same code
 * ignored, and the outcome handed to `onResult`.
 */
export function useScanTicket({ eventId, onResult }: UseScanTicketOptions) {
  const { session } = useSession();
  const token = session?.token ?? '';
  const userId = session?.user.id ?? '';
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const last = useRef<{ code: string; at: number } | null>(null);
  // A code that failed for a reason other than the network: retrying it would fail the same way,
  // so it is ignored until the error is dismissed or another code is scanned.
  const failedCode = useRef<string | null>(null);

  const handleScan = async (raw: string) => {
    const code = raw.trim();
    const now = Date.now();
    if (busy.current || !code || code === failedCode.current) return;
    if (last.current?.code === code && now - last.current.at < REPEAT_COOLDOWN_MS) return;
    failedCode.current = null;
    last.current = { code, at: now };

    if (code.length > MAX_CODE_LENGTH) {
      onResult({ result: 'invalid', ticket: null });
      return;
    }

    busy.current = true;
    setPending(true);
    setError(null);
    try {
      onResult(await checkIn(token, userId, eventId, code));
    } catch (e) {
      if (e instanceof ApiError && !isConnectivityError(e)) {
        // The server answered with an error; the same code would get the same answer.
        failedCode.current = code;
      } else {
        // No answer (network, timeout, gateway): allow an immediate retry of the same code.
        last.current = null;
      }
      setError(errorMessage(e));
    } finally {
      busy.current = false;
      // Restart the cooldown so the code still in front of the camera is not re-read on return.
      if (last.current) last.current = { code, at: Date.now() };
      setPending(false);
    }
  };

  const clearError = () => {
    failedCode.current = null;
    setError(null);
  };

  return { handleScan, pending, error, clearError };
}
