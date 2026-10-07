export interface Analytics { track(name: string, properties?: Record<string, unknown>): void; }
export const analytics: Analytics = { track() {} };
