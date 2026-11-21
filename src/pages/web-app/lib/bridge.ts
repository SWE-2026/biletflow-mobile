import type { Session } from '@/entities/session';

const STORAGE_KEY = 'biletflow.session';

export type WebAppMessage =
  | { type: 'session'; session: Session | null }
  | { type: 'download'; fileName: string; mimeType: string; base64: string };

export function sessionInjectionScript(session: Session | null, webOrigin: string): string {
  const stored = session ? JSON.stringify(JSON.stringify(session)) : 'null';
  return `(function () {
  try {
    if (location.origin.toLowerCase() !== ${JSON.stringify(webOrigin)}) return;
    var value = ${stored};
    if (value === null) localStorage.removeItem(${JSON.stringify(STORAGE_KEY)});
    else localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, value);
  } catch (e) {}
})();
true;`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSession(value: unknown): value is Session {
  if (!isRecord(value) || typeof value.token !== 'string' || !isRecord(value.user)) return false;
  const { id, email, role } = value.user;
  return typeof id === 'string' && typeof email === 'string' && typeof role === 'string';
}

export function parseWebAppMessage(data: string): WebAppMessage | null {
  let message: unknown;
  try {
    message = JSON.parse(data);
  } catch {
    return null;
  }
  if (!isRecord(message)) return null;

  if (message.type === 'session') {
    if (message.session === null) return { type: 'session', session: null };
    return isSession(message.session) ? { type: 'session', session: message.session } : null;
  }
  if (
    message.type === 'download' &&
    typeof message.fileName === 'string' &&
    typeof message.mimeType === 'string' &&
    typeof message.base64 === 'string'
  ) {
    return {
      type: 'download',
      fileName: message.fileName,
      mimeType: message.mimeType,
      base64: message.base64,
    };
  }
  return null;
}
