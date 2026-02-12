const cache = new Map<string, { data: unknown; expiry: number }>();

export const TTL_MS = 60_000;

const MAX_CACHE_SIZE = 500;

export const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);

  if (!entry) return null;
  if (entry.expiry <= Date.now()) {
    cache.delete(key);
    return null;
  }

  cache.delete(key);
  cache.set(key, entry);

  return entry.data as T;
};

export const setCache = (
  key: string,
  data: unknown,
  ttlMs: number = TTL_MS
): void => {
  while (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey === undefined) break;
    cache.delete(firstKey);
  }

  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  });
};

export const makeCacheKey = (
  publicKey: string,
  action: string,
  ...params: string[]
): string => {
  return `${publicKey}:${action}:${params.join(":")}`;
};

export const invalidateByPrefix = (publicKey: string): void => {
  const prefix = `${publicKey}:`;

  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};
