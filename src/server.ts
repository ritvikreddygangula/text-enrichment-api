import 'dotenv/config';
import app from './app';
import { connectRedis } from './cache/redis';

const DEFAULT_PORT = 3000;

async function start() {
  await connectRedis().catch((err) => {
    console.warn('Redis connect skipped or failed:', err?.message ?? err);
  });

  const tryListen = (port: number, maxTries = 5) => {
    if (maxTries <= 0) {
      console.error('Could not find an available port.');
      process.exit(1);
    }
    const server = app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
    server.on('error', (err: Error & { code?: string }) => {
      if (err.code === 'EADDRINUSE') {
        server.close();
        console.warn(`Port ${port} in use, trying ${port + 1}...`);
        tryListen(port + 1, maxTries - 1);
      } else {
        throw err;
      }
    });
  };

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  tryListen(port);
}

start();
