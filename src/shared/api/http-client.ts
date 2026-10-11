import { env } from '@/shared/config';

/** Error returned by the BiletFlow API: `{ code, message, fields? }` (see biletflow-api/docs/api.md). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Record<string, string> = {},
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

function readString(data: unknown, key: string): string | undefined {
  if (typeof data !== 'object' || data === null || !(key in data)) return undefined;
  const value: unknown = Reflect.get(data, key);
  return typeof value === 'string' ? value : undefined;
}

function readFields(data: unknown): Record<string, string> {
  const fields: unknown = typeof data === 'object' && data !== null ? Reflect.get(data, 'fields') : undefined;
  if (typeof fields !== 'object' || fields === null) return {};
  return Object.fromEntries(
    Object.entries(fields).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, signal }: RequestOptions = {},
): Promise<T> {
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
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'network_error', 'No connection. Check your network and try again.');
  }

  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      readString(data, 'code') ?? 'http_error',
      readString(data, 'message') ?? `Request failed (${response.status})`,
      readFields(data),
    );
  }

  return data as T;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
