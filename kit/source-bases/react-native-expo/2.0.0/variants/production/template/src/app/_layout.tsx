import { Stack } from 'expo-router';
import { AppBootstrapGate } from '@/core/bootstrap/AppBootstrapGate';

export default function RootLayout() {
  return (
    <AppBootstrapGate>
      <Stack screenOptions={{ headerShown: false }} />
    </AppBootstrapGate>
  );
}
