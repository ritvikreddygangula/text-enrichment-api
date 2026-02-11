# Text Enrichment API

A backend REST API that accepts text and returns structured JSON (keywords, category, entities). Protected by API keys, rate-limited, with usage logging and Swagger docs.

## Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MongoDB (Prisma ORM; works with MongoDB Atlas)
- **Cache / rate limit:** Redis
- **Docs:** OpenAPI / Swagger UI

## Local run

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set `DATABASE_URL` to your MongoDB connection string:

   ```bash
   cp .env.example .env
   ```

   **MongoDB Atlas (free tier):** Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), then **Database → Connect → Drivers → Node.js** and copy the connection string. Replace `<password>` with your DB user password.

   **Important for Prisma:**
   - The URL must include a **database name** after the host: `...mongodb.net/text_enrichment?retryWrites=...`
   - If your **password has special characters** (`@`, `#`, `:`, `/`, etc.), URL-encode them (e.g. `@` → `%40`) or create an Atlas user with a letters-and-numbers-only password. Otherwise the URL is invalid and Prisma will throw P1013.

3. **Database (Prisma)**

   Push the schema to MongoDB (creates collections for `User` and `ApiKey`):

   ```bash
   npx prisma db push
   ```

   Or use `npm run db:push`.

   **Redis (rate limiting):** Set `REDIS_URL` in `.env` (e.g. `redis://localhost:6379`). If unset, rate limiting is skipped (requests are still allowed).

4. **Start the server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000` (or the port set in `PORT`).

## Scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start dev server with hot reload (tsx watch)     |
| `npm run build`   | Compile TypeScript to `dist/`                    |
| `npm run start`   | Run compiled app (`node dist/server.js`)         |
| `npm run lint`    | Run ESLint on `src/`                             |
| `npm run format`  | Format code with Prettier                        |
| `npm run db:push` | Sync Prisma schema to MongoDB (`prisma db push`) |

## Verify

Health check:

```bash
curl http://localhost:3000/health
```

Expected response (global response shape):

```json
{ "success": true, "data": { "ok": true }, "error": null }
```
