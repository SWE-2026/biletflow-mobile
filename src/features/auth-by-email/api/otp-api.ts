import type { Session } from '@/entities/session';
import { apiRequest } from '@/shared/api';
import { env } from '@/shared/config';

/** No backend configured: accept a fixed code so the flow is usable in dev. */
export const isMockAuth = env.apiUrl === null;
export const MOCK_OTP_CODE = '123456';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function requestOtp(email: string): Promise<void> {
  if (isMockAuth) {
    await delay(500);
    return;
  }
  await apiRequest<void>('/auth/otp/request', { method: 'POST', body: { email } });
}

export async function verifyOtp(email: string, code: string): Promise<Session> {
  if (isMockAuth) {
    await delay(500);
    if (code !== MOCK_OTP_CODE) throw new Error('Invalid or expired code.');
    return { token: `mock-${Date.now()}`, user: { id: 'mock-user', email } };
  }
  return apiRequest<Session>('/auth/otp/verify', { method: 'POST', body: { email, code } });
}
