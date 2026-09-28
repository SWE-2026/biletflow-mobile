/**
 * Public runtime config. `EXPO_PUBLIC_*` vars are inlined at build time.
 * Leave `EXPO_PUBLIC_API_URL` unset to run auth against the in-app mock.
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || null,
} as const;
