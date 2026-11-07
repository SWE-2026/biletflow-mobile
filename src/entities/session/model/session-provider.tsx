import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { apiRequest, setUnauthorizedHandler } from '@/shared/api';
import { secureStorage } from '@/shared/lib';

import type { Session, SessionStatus } from './types';

const STORAGE_KEY = 'biletflow.session';

type SessionContextValue = {
  status: SessionStatus;
  session: Session | null;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    secureStorage
      .get(STORAGE_KEY)
      .then((raw) => {
        const parsed = raw ? (JSON.parse(raw) as Partial<Session>) : null;
        // Sessions stored before the API contract included roles are discarded
        const restored = parsed?.token && parsed.user?.role ? (parsed as Session) : null;
        setSession(restored);
        setStatus(restored ? 'signed-in' : 'signed-out');
      })
      .catch(() => setStatus('signed-out'));
  }, []);

  // A revoked or expired token signs the device out locally (no logout call: the token is dead).
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSession(null);
      setStatus('signed-out');
      secureStorage.remove(STORAGE_KEY).catch(() => undefined);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const signIn = async (next: Session) => {
    await secureStorage.set(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    setStatus('signed-in');
  };

  const signOut = async () => {
    // Revoke the token server-side, but sign out locally even if that request fails
    if (session) {
      apiRequest('/auth/logout', { method: 'POST', token: session.token }).catch(() => undefined);
    }
    setSession(null);
    setStatus('signed-out');
    await secureStorage.remove(STORAGE_KEY);
  };

  return <SessionContext value={{ status, session, signIn, signOut }}>{children}</SessionContext>;
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession must be used within SessionProvider');
  return value;
}

/** The signed-in user's API token. Empty while signing out, so requests then fail with 401. */
export function useAuthToken(): string {
  return useSession().session?.token ?? '';
}
