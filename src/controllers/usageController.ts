import { Request, Response } from 'express';
import { prisma } from '../db/client';

const DEFAULT_LIMIT = 50;

function success<T>(res: Response, data: T): void {
  res.status(200).json({
    success: true,
    data,
    error: null,
  });
}

function error(res: Response, status: number, message: string, code: string): void {
  res.status(status).json({
    success: false,
    data: null,
    error: { message, code },
  });
}

export async function getUsage(req: Request, res: Response): Promise<void> {
  const apiKeyId = req.context?.apiKeyId;
  if (!apiKeyId) {
    error(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    return;
  }

  const logs = await prisma.requestLog.findMany({
    where: { apiKeyId },
    orderBy: { createdAt: 'desc' },
    take: DEFAULT_LIMIT,
    select: {
      id: true,
      method: true,
      path: true,
      statusCode: true,
      durationMs: true,
      textLength: true,
      createdAt: true,
    },
  });

  success(res, { logs });
}
