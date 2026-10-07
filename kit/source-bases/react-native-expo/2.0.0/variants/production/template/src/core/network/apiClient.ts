import { AppError } from '@/core/errors/AppError';
import { env } from '@/core/config/env';

export type ApiRequest = RequestInit & { path: string; timeoutMs?: number };

export async function apiRequest<T>({ path, timeoutMs = 15000, ...init }: ApiRequest): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, { ...init, signal: controller.signal });
    if (response.status === 401) throw new AppError('authentication', 'Authentication required');
    if (response.status === 403) throw new AppError('authorization', 'Access denied');
    if (!response.ok) throw new AppError('server', `Request failed with ${response.status}`);
    return await response.json() as T;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error && error.name === 'AbortError') throw new AppError('timeout', 'Request timed out', error);
    throw new AppError('network', 'Network request failed', error);
  } finally {
    clearTimeout(timer);
  }
}

// Add authentication header injection and single-flight refresh in the session integration layer.
