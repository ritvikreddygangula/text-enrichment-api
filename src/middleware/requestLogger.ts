import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const apiKeyId = req.context?.apiKeyId;
    if (!apiKeyId) return;

    const durationMs = Date.now() - start;
    const textLength =
      req.method === 'POST' && req.path === '/enrich' && typeof req.body?.text === 'string'
        ? req.body.text.length
        : null;

    prisma.requestLog
      .create({
        data: {
          apiKeyId,
          method: req.method,
          path: req.originalUrl?.split('?')[0] ?? req.path,
          statusCode: res.statusCode,
          durationMs,
          textLength,
        },
      })
      .catch((err) => console.error('Request log failed:', err?.message ?? err));
  });

  next();
}
