import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';
import { hashApiKey } from '../utils/keyUtils';

const UNAUTHORIZED_CODE = 'UNAUTHORIZED';

function sendUnauthorized(res: Response, message: string): void {
  res.status(401).json({
    success: false,
    data: null,
    error: { message, code: UNAUTHORIZED_CODE },
  });
}

export async function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendUnauthorized(
      res,
      'Missing or invalid Authorization header. Use: Bearer <API_KEY>'
    );
    return;
  }

  const rawKey = authHeader.slice(7).trim();
  if (!rawKey) {
    sendUnauthorized(res, 'Missing API key');
    return;
  }

  const keyHash = hashApiKey(rawKey);
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { user: true },
  });

  if (!apiKey) {
    sendUnauthorized(res, 'Invalid API key');
    return;
  }

  req.context = {
    userId: apiKey.userId,
    apiKeyId: apiKey.id,
  };
  next();
}
