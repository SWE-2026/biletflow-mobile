import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

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
        const restored = raw ? (JSON.parse(raw) as Session) : null;
        setSession(restored);
        setStatus(restored ? 'signed-in' : 'signed-out');
      })
      .catch(() => setStatus('signed-out'));
  }, []);

  const signIn = async (next: Session) => {
    await secureStorage.set(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    setStatus('signed-in');
  };

  const signOut = async () => {
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
