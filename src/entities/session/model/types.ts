export type User = {
  id: string;
  email: string;
  displayName: string;
  role: 'customer' | 'organizer' | 'staff' | 'admin';
  organizerId: string | null;
  emailVerified: boolean;
  hasPassword: boolean;
  createdAt: string;
};

export type Session = {
  token: string;
  user: User;
};

export type SessionStatus = 'loading' | 'signed-in' | 'signed-out';
