import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../cache/redis';

const WINDOW_SECONDS = 60;
let warnedNoRedis = false;
const MAX_REQUESTS = 60;
const KEY_PREFIX = 'rl:';
const RATE_LIMIT_CODE = 'RATE_LIMIT_EXCEEDED';

function sendTooManyRequests(res: Response): void {
  res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', '0');
  res.status(429).json({
    success: false,
    data: null,
    error: {
      message: `Rate limit exceeded. Maximum ${MAX_REQUESTS} requests per ${WINDOW_SECONDS} seconds.`,
      code: RATE_LIMIT_CODE,
    },
  });
}

export async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apiKeyId = req.context?.apiKeyId;
  if (!apiKeyId) {
    next();
    return;
  }

  const redis = getRedis();
  if (!redis) {
    if (!warnedNoRedis) {
      warnedNoRedis = true;
      console.warn('Rate limiting disabled: REDIS_URL not set in .env');
    }
    next();
    return;
  }

  try {
    if (!redis.isOpen) await redis.connect();
  } catch {
    next();
    return;
  }

  try {
    const key = `${KEY_PREFIX}${apiKeyId}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, WINDOW_SECONDS);

    const remaining = Math.max(0, MAX_REQUESTS - count);
    res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS));
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    if (count > MAX_REQUESTS) {
      sendTooManyRequests(res);
      return;
    }
    next();
  } catch {
    next();
  }
}
