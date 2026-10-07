type Meta = Record<string, unknown>;

function safe(meta?: Meta) {
  if (!meta) return undefined;
  const copy = { ...meta };
  for (const key of ['token', 'password', 'authorization', 'cookie']) if (key in copy) copy[key] = '[REDACTED]';
  return copy;
}

export const logger = {
  info(message: string, meta?: Meta) { console.info(message, safe(meta)); },
  warn(message: string, meta?: Meta) { console.warn(message, safe(meta)); },
  error(message: string, meta?: Meta) { console.error(message, safe(meta)); },
};
