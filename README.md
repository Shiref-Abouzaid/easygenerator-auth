# Auth Module

A sign-up / sign-in module with a protected application page. The frontend uses Vue 3 + TypeScript; the backend uses NestJS + MongoDB.

> Technical assessment project. Not an official Easygenerator product.

## Live demo

- App: https://easygenerator-auth.pages.dev
- API docs (Swagger): https://easygenerator-task-api.onrender.com/api/docs

The API runs on Render's free tier, which sleeps when idle. If the API is asleep, the first request can take up to a minute.

## Running locally

You need Node.js 24+ and a MongoDB connection string. Use a free Atlas cluster, or run MongoDB locally with Docker:

```bash
docker run -d -p 27017:27017 mongo:8
```

**Backend:** runs on `http://localhost:3000/api`, with Swagger at `/api/docs`.

```bash
cd backend
cp .env.example .env
npm ci
npm run start:dev
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string, including the database name |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN_SECONDS` | Token lifetime, e.g. `3600` |
| `CORS_ORIGIN` | Frontend origin, e.g. `http://localhost:5173` |

**Frontend:** runs on `http://localhost:5173`.

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

`.env.example` points the frontend at the local API: `VITE_API_URL=http://localhost:3000/api`.

## Tests and checks

```bash
# backend
npm run lint && npm test && npm run test:e2e

# frontend
npm run lint && npm run test:unit -- --run
```

GitHub Actions runs lint, format check, tests and build on every pull request. Merging to `main` deploys the backend to Render and the frontend to Cloudflare Pages.

## Key decisions

- **Validation in both layers, with the same rules.** The backend is the source of truth, and its errors come back per field so the form shows them under the right input. The frontend repeats the same rules so users get instant feedback.
- **Passwords are hashed with argon2id.** The hash is excluded from queries by default and never appears in a response.
- **Sign-in doesn't reveal which accounts exist.** It returns the same error for an unknown email and for a wrong password.
- **Hardening:**
  - Rate limiting: 10/min on the auth routes, 60/min elsewhere. Behind Render it uses the real client IP from `True-Client-IP`.
  - Helmet for security headers, and a CORS allowlist.
  - The MongoDB user only has `readWrite` on the app database, and Atlas only accepts connections from Render's IP ranges.
  - Request logging that never includes request bodies.
- **The token is a short-lived JWT, sent as a Bearer header.**
  - It is stored in `localStorage`, which a script injected through an XSS bug could read. To limit that risk, the token expires after 1 hour, and the app never renders raw HTML (no `v-html`).
  - An httpOnly cookie would be safer, but the frontend and API are on different sites, and Safari blocks cross-site cookies.
  - In production I would serve both from one domain and use httpOnly cookies with refresh tokens.
- **Frontend layers:**
  - `views/` only renders a component.
  - `components/` is UI only.
  - `composables/` and `stores/` hold the logic.
  - `services/` talks to the API.

## AI usage

See [AI.md](./AI.md).
