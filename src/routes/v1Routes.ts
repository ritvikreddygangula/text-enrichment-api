import { Router, Request, Response } from 'express';
import * as enrichController from '../controllers/enrichController';

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

/**
 * Enrich text: returns keywords, entities, and category.
 * POST /v1/enrich with body { "text": "..." }, text length >= 20.
 */
router.post('/enrich', enrichController.enrich);

export default router;
