import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';
import v1Routes from './routes/v1Routes';
import { apiKeyAuth } from './middleware/apiKeyAuth';

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

// Protected v1 routes: require valid API key (Bearer token)
app.get('/v1/protected-check', apiKeyAuth, (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { ok: true }, error: null });
});
app.use('/v1', apiKeyAuth, v1Routes);

export default app;
