/**
 * Public runtime config. `EXPO_PUBLIC_*` vars are inlined at build time.
 * `EXPO_PUBLIC_API_URL` is the BiletFlow API base URL including `/api/v1`. The default reaches the
 * API from `docker compose up` in biletflow-api on the iOS simulator and web; an Android emulator
 * needs `http://10.0.2.2:8080/api/v1`, a physical device your machine's LAN IP.
 */
export const env = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, ''),
} as const;
