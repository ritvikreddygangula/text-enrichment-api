import { Request, Response } from 'express';
import * as authService from '../services/authService';

function success<T>(res: Response, status: number, data: T): void {
  res.status(status).json({
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

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const email = req.body?.email;
    if (typeof email !== 'string') {
      error(res, 400, 'Missing or invalid email', 'INVALID_INPUT');
      return;
    }

    const result = await authService.register(email);
    success(res, 201, {
      email: result.email,
      apiKey: result.apiKey,
    });
  } catch (err) {
    if (err instanceof authService.AuthServiceError) {
      const status = err.code === 'INVALID_EMAIL' ? 400 : 422;
      error(res, status, err.message, err.code);
      return;
    }
    error(res, 500, 'Registration failed', 'REGISTRATION_FAILED');
  }
}
