import { validatePublicEnvironment } from '@/core/config/env';
import { logger } from '@/core/logging/logger';

export type BootstrapResult = { status: 'ready' };

export async function bootstrapApplication(): Promise<BootstrapResult> {
  logger.info('bootstrap:start');
  validatePublicEnvironment();
  // Bind reviewed project adapters here: session restore, storage/cache migration, remote flags,
  // notification/deep-link initial intent and optional session validation. Keep the sequence explicit.
  logger.info('bootstrap:ready');
  return { status: 'ready' };
}
