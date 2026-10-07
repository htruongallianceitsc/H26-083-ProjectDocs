export type InitialIntent = { kind: 'none' } | { kind: 'route'; href: string };

export interface NotificationRuntime {
  captureInitialIntent(): Promise<InitialIntent>;
  registerForPushIfAllowed(): Promise<void>;
}
