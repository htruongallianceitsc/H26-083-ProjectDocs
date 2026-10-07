export type SessionState = { status: 'anonymous' | 'authenticated'; accessToken?: string };

export interface SessionStore {
  restore(): Promise<SessionState>;
  persist(state: SessionState): Promise<void>;
  clear(): Promise<void>;
}

// The project must bind SessionStore to approved secure storage when tokens are persisted.
export const anonymousSession: SessionState = { status: 'anonymous' };
