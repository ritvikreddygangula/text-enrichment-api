import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;
let errorLogged = false;

export function getRedis(): RedisClientType | null {
  if (client) return client;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  client = createClient({ url });
  client.on('error', (err) => {
    if (!errorLogged) {
      errorLogged = true;
      console.warn(
        'Redis client error (rate limiting may be disabled):',
        err?.message ?? err
      );
    }
  });
  return client;
}

export async function connectRedis(): Promise<void> {
  const c = getRedis();
  if (c && !c.isOpen) await c.connect();
}
