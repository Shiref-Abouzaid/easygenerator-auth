# AI Usage

I built this project with an AI assistant (Claude) as a pair programmer. The AI drafted most of the code and the setup steps. I reviewed every file before adding it, ran every command myself, and checked each step (lint, type-check, tests, manual testing in the browser) before moving on.

## How I worked with it

- **One small step at a time.** I asked for a single file or change per step, with an explanation of what it does, and I didn't continue until it worked locally. This kept every change small enough to review properly.
- **Real output instead of descriptions.** When something failed, I pasted the actual terminal output, deployment logs or screenshots instead of describing the problem.
- **"Is this the common practice, or just your preference?"** I asked this whenever a structure or naming choice looked unfamiliar, and asked the AI to back it up with documentation. Several suggestions changed because of it (see below).
- **Verify before changing things.** For deployment problems, I asked the AI to reproduce the issue first (for example, by cloning the public repo and running the same build command as Render) before proposing a fix.

## What was AI-assisted

- Project scaffolding and tooling: Vue + Vite + TypeScript, NestJS, ESLint/Prettier, Tailwind.
- Backend: Mongoose schema, DTOs with `class-validator`, auth service (argon2 + JWT), JWT guard, protected `/api/users/me`, validation error format, Helmet, CORS, rate limiting, Swagger, request logging.
- Frontend: base input/button components, sign-in/sign-up forms, Pinia store, composables, API service layer, route guards, client-side validation.
- Tests (Jest unit + e2e, Vitest) and the GitHub Actions workflow.
- Step-by-step setup for MongoDB Atlas, Render and Cloudflare Pages.

## Where the AI output needed fixing

- **`.gitignore`:** the pattern `.vscode/*` only matched the repo root, so `frontend/.vscode/settings.json` showed up in git. I noticed it and it was changed to `**/.vscode/*`.
- **Outdated deployment instructions:** the AI described the old Cloudflare Pages flow. The dashboard now defaults to Workers, and the Pages option is a small link at the bottom of the page.
- **Folder structure assumed without asking:** the AI first used a Feature-Sliced Design layout. I asked for the classic Vue structure instead (`views/`, `components/`, `composables/`, `services/`, `stores/`) and set the rule that a view only imports one component and contains no logic or styling.
- **Logic in the wrong place:** the form-error helper was first a set of plain functions in `utils/`. I pointed out that it holds form state, so it is logic, and it became the `useFormErrors` composable.
- **Bugs caught in manual testing:**
  - The sign-up form had no input for the password confirmation, so submitting failed silently.
  - Error messages didn't disappear while the user fixed the input. Fields are now re-validated as you type after the first submit.
- **Scaffold defaults that no longer worked:**
  - With TypeScript 6, Jest needed an explicit `rootDir`.
  - NestJS 12 packages are ESM-only, so Jest needs `--experimental-vm-modules`.
- **JWT expiry:** a string such as `"1h"` read from the environment didn't type-check, and a bare number string would have been read as milliseconds. It is now `JWT_EXPIRES_IN_SECONDS`.

## Problems found during deployment

- **`npm ci` failed on Render** with `Missing: @emnapi/core from lock file`. This is a known npm bug: a lockfile generated on Windows can leave out optional packages that Linux needs.
  - Fix: pinned `@emnapi/*` as `optionalDependencies` and regenerated the lockfile on Linux.
  - CI now runs `npm ci` on Linux, so this kind of problem shows up in the PR before it reaches Render.
- **The API URL was `undefined` in production.** Vite reads `VITE_*` variables at build time, so the frontend had to be rebuilt after `VITE_API_URL` was set on Cloudflare.
- **Rate limiting behind a proxy.** On Render, `req.ip` is the proxy's address, and `X-Forwarded-For` can be spoofed. The limiter uses `True-Client-IP` instead, which Cloudflare sets in front of Render.
- **Logs showed two lines per sign-in.** I asked why. The first line is the browser's CORS preflight (`OPTIONS`) and the second is the actual request, so it is expected behaviour.

## Decisions I made differently from the AI's suggestions

- **Classic Vue folder structure** instead of Feature-Sliced Design (above).
- **Bearer token instead of an httpOnly cookie.** The AI proposed proxying `/api` through a Cloudflare Pages Function, so the frontend and backend would share an origin and could use an httpOnly cookie. I chose a simpler setup that is common in practice: a Bearer token, stored in `localStorage`, with a short expiry. The trade-off (XSS exposure) is documented in the README.
- **Password confirmation field.** The task doesn't require it and the AI suggested skipping it. I added it as a frontend-only check, and the backend still receives a single password.
- **Validation in both layers.** I wanted the backend to be the source of truth first, with the frontend showing backend errors under each field, and only then added matching frontend validation.

## Decisions where I followed the AI's advice

- Skipped Storybook. There are only a few components, and the time was better spent on tests, CI and API docs, which are listed as bonus points.
- Least-privilege MongoDB user (`readWrite` on the app database only) and an IP access list limited to Render's outbound ranges, instead of allowing access from anywhere.
- Same error message for "unknown email" and "wrong password" to avoid user enumeration, and no password-strength rules on sign-in.
