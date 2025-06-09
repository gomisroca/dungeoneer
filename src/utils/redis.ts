import { env } from '@/env';
import { Redis } from '@upstash/redis';
import { cache } from 'react';

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const cached = cache(async <T>(key: string, fetchFn: () => Promise<T>, ttl = 60): Promise<T> => {
  const cached = await redis.get(key);
  if (cached !== null) return cached as T;

  const result = await fetchFn();
  await redis.set(key, result, { ex: ttl });
  return result;
});
