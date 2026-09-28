const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isValidEmail = (email: string) => EMAIL_RE.test(normalizeEmail(email));
