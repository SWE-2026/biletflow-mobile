/**
 * Public runtime config. `EXPO_PUBLIC_*` vars are inlined at build time.
 * `EXPO_PUBLIC_API_URL` is the BiletFlow API base URL including `/api/v1`. The default reaches the
 * API from `docker compose up` in biletflow-api on the iOS simulator and web; an Android emulator
 * needs `http://10.0.2.2:8080/api/v1`, a physical device your machine's LAN IP.
 */
const apiUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');
const webUrl = (process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:5173').replace(/\/$/, '');

export const env = {
  apiUrl,
  webUrl,
  webOrigin: originOf(webUrl) ?? webUrl,
} as const;

export function originOf(url: string): string | null {
  const match = /^https?:\/\/[^/?#]+/i.exec(url);
  return match ? match[0].toLowerCase() : null;
}
