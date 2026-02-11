import { Request, Response } from 'express';
import * as enrichService from '../services/enrichService';

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

export async function enrich(req: Request, res: Response): Promise<void> {
  const text = req.body?.text;
  if (typeof text !== 'string') {
    error(res, 400, 'Missing or invalid text', 'INVALID_INPUT');
    return;
  }

  const trimmed = text.trim();
  if (trimmed.length < enrichService.MIN_ENRICH_TEXT_LENGTH) {
    error(
      res,
      400,
      `Text must be at least ${enrichService.MIN_ENRICH_TEXT_LENGTH} characters`,
      'INVALID_INPUT'
    );
    return;
  }

  const result = enrichService.enrichText(trimmed);
  success(res, result);
}
