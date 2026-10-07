export type ConnectivityState = 'unknown' | 'offline' | 'online';
export type ConnectivityListener = (state: ConnectivityState) => void;

export interface ConnectivityRuntime {
  current(): Promise<ConnectivityState>;
  subscribe(listener: ConnectivityListener): () => void;
}
