# Text Enrichment API

A backend REST API that accepts text and returns structured JSON (keywords, category, entities). Protected by API keys, rate-limited, with usage logging and Swagger docs.

## Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** PostgreSQL (Prisma ORM)
- **Cache / rate limit:** Redis
- **Docs:** OpenAPI / Swagger UI

## Local run

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and adjust if needed:

   ```bash
   cp .env.example .env
   ```

3. **Start the server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000` (or the port set in `PORT`).

## Scripts

| Script           | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start dev server with hot reload (tsx watch) |
| `npm run build`  | Compile TypeScript to `dist/`                |
| `npm run start`  | Run compiled app (`node dist/server.js`)     |
| `npm run lint`   | Run ESLint on `src/`                         |
| `npm run format` | Format code with Prettier                    |

## Verify

Health check:

```bash
curl http://localhost:3000/health
```

Expected response (global response shape):

```json
{ "success": true, "data": { "ok": true }, "error": null }
```
