import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { bootstrapApplication } from './bootstrapApplication';

type State = 'starting' | 'ready' | 'error';

export function AppBootstrapGate({ children }: PropsWithChildren) {
  const [state, setState] = useState<State>('starting');
  const run = useCallback(() => {
    setState('starting');
    void bootstrapApplication().then(() => setState('ready')).catch(() => setState('error'));
  }, []);
  useEffect(() => { run(); }, [run]);
  if (state === 'ready') return children;
  if (state === 'error') return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}><Text>Unable to start the app.</Text><Button title="Retry" onPress={run} /></View>;
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
}
