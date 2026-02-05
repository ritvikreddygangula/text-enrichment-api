import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Protected route to verify API key auth.
 * GET /v1/protected-check with valid Authorization: Bearer <API_KEY> returns 200.
 */
router.get('/protected-check', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { ok: true },
    error: null,
  });
});

export default router;
