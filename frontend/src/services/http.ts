import { tokenStorage } from '@/services/token';

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldError[];

  constructor(status: number, message: string, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL;
// The free backend sleeps when idle and can take up to a minute to wake up.
const TIMEOUT_MS = 60_000;

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === 'TimeoutError'
        ? 'The server is taking too long to respond. Please try again.'
        : 'Unable to reach the server. Please check your connection.';
    throw new ApiError(0, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const { message, errors } = (body ?? {}) as { message?: string; errors?: FieldError[] };
    throw new ApiError(
      response.status,
      message ?? 'Something went wrong. Please try again.',
      errors ?? [],
    );
  }

  return body as T;
}