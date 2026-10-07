export type AppErrorKind = 'validation' | 'authentication' | 'authorization' | 'network' | 'timeout' | 'server' | 'cancelled' | 'unexpected';

export class AppError extends Error {
  constructor(public readonly kind: AppErrorKind, message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'AppError';
  }
}
