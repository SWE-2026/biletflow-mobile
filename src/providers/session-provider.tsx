import { createContext, use, useState, type PropsWithChildren } from 'react';

// TODO: replace with real auth (token storage + API). Stubbed so every route is reachable in dev.
type Session = {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <SessionContext
      value={{
        isSignedIn,
        signIn: () => setIsSignedIn(true),
        signOut: () => setIsSignedIn(false),
      }}>
      {children}
    </SessionContext>
  );
}

export function useSession() {
  const session = use(SessionContext);
  if (!session) throw new Error('useSession must be used within SessionProvider');
  return session;
}
