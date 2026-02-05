import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { ok: true },
    error: null,
  });
});

export default app;
