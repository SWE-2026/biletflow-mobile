import { env } from '@/shared/config';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
};

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, signal }: RequestOptions = {},
): Promise<T> {
  if (!env.apiUrl) throw new Error('EXPO_PUBLIC_API_URL is not set');

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'No connection. Check your network and try again.');
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}
