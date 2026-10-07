import type { ExpoConfig } from 'expo/config';

const appEnv = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';

const config: ExpoConfig = {
  name: '__APP_NAME__',
  slug: '__PACKAGE_NAME__',
  scheme: '__PACKAGE_NAME__',
  version: '0.1.0',
  orientation: 'portrait',
  plugins: ['expo-router'],
  experiments: { typedRoutes: true },
  runtimeVersion: { policy: 'appVersion' },
  extra: { appEnv },
};

export default config;
