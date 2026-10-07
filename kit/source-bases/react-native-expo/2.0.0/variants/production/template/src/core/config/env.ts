export const env = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
} as const;

export function validatePublicEnvironment() {
  if (!env.appEnv) throw new Error('EXPO_PUBLIC_APP_ENV is required');
}
