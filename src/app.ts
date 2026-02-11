import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';
import v1Routes from './routes/v1Routes';
import { apiKeyAuth } from './middleware/apiKeyAuth';
import { rateLimit } from './middleware/rateLimit';

const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { ok: true },
    error: null,
  });
});

app.use('/v1/auth', authRoutes);

// Protected v1 routes: require valid API key + rate limit (60/min per key)
app.get('/v1/protected-check', apiKeyAuth, rateLimit, (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { ok: true }, error: null });
});
app.use('/v1', apiKeyAuth, rateLimit, v1Routes);

export default app;
