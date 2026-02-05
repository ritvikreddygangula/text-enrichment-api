import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';

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

export default app;
