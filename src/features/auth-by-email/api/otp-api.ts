import type { Session } from '@/entities/session';
import { apiRequest } from '@/shared/api';

export type OtpChallenge = {
  expiresInSeconds: number;
  resendInSeconds: number;
  /** Only when the API runs in local mode without an email provider. */
  demoCode?: string;
};

export function requestOtp(email: string): Promise<OtpChallenge> {
  return apiRequest<OtpChallenge>('/auth/otp/request', { method: 'POST', body: { email } });
}

export function verifyOtp(email: string, code: string): Promise<Session> {
  return apiRequest<Session>('/auth/otp/verify', { method: 'POST', body: { email, code } });
}
