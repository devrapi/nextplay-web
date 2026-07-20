# NextPlay — AI Agent Instructions

This document is the source of truth for any AI coding agent (Claude Code, Cursor, Copilot, etc.)
working on the NextPlay project. Read this fully before making changes. If something here
conflicts with a prompt you're given, prefer this document unless the human explicitly overrides it.

---

## 1. Project Overview

NextPlay is a sports league management system, similar in spirit to PBA.ph, with two audiences:

1. **Public Website** — fans, teams, visitors view schedules, standings, news, galleries, stats.
2. **Admin Portal** — league administrators manage seasons, tournaments, teams, players, games,
   results, news, and gallery content.

**Core features:** multiple seasons, multiple tournaments, multiple sports categories/divisions,
team & player management, game scheduling, automatic standings, player statistics, news publishing,
gallery management, reports, mobile responsive, SEO-friendly public pages. Live scoring is optional/
stretch scope — do not build it unless explicitly asked.

**Why this project exists:** the owner is using it to deliberately practice automated CI/CD,
complex API integration, unit testing, and cloud deployment as part of leveling up as a software
engineer. This means: prefer clear, testable, incrementally-shippable work over clever shortcuts.
Every feature should come with tests. Don't skip tests "to move faster."

---

## 2. Tech Stack (do not substitute without asking)

| Layer                 | Choice                                                      |
| --------------------- | ----------------------------------------------------------- |
| Backend               | Laravel (latest stable), PHP                                |
| Frontend              | React + TypeScript, Vite                                    |
| Styling               | Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`) |
| Database              | MySQL                                                       |
| Auth                  | Laravel Sanctum                                             |
| Backend tests         | Pest                                                        |
| Frontend tests        | Vitest + React Testing Library                              |
| API client (frontend) | axios                                                       |
| Routing (frontend)    | react-router-dom                                            |

---

## 3. Repository Structure

Two separate repos:

- **`nextplay-api`** — Laravel REST API only. No Blade views, no server-rendered pages.
- **`nextplay-web`** — Single React + TS app serving BOTH the public site and the admin portal,
  separated by route and role-based guards (not two separate apps).

### `nextplay-web` internal structure

```
src/
├── features/
│   ├── public/       # standings, schedules, news, gallery
│   └── admin/         # game entry, roster mgmt, publishing
├── shared/
│   ├── api/           # axios instance, API hooks
│   ├── components/
│   └── types/
├── routes/
```

Keep public and admin code logically separated inside `features/` even though they share a
codebase and a deploy. Shared primitives (buttons, layout, API client) live in `shared/`.

---

## 4. Domain Model (initial)

- `Season` → has many `Tournaments`
- `Tournament` → has many `Divisions`, `Teams`
- `Team` → has many `Players` (via roster — players can move between seasons, don't hard-link
  a player permanently to one team)
- `Game` → belongs to a `Tournament`, references two `Teams`, has many `GameStats`
- `Standing` → **derived**, not a raw source of truth. Compute from game results, or cache
  computed values — never treat a manually-editable `standings` table as canonical.
- `News`, `GalleryAlbum` / `GalleryImage`

If you need to add tables/relationships beyond this, flag it to the human rather than silently
expanding scope.

---

## 5. Coding Conventions

### Laravel (`nextplay-api`)

- Follow PSR-12.
- Use **Form Requests** for validation — no inline `$request->validate()` in controllers for
  anything beyond a trivial one-off.
- Use **API Resources** to shape every JSON response. Never return raw Eloquent models.
- Use **Policies** for authorization (admin vs public, role checks) — not ad-hoc `if` checks
  scattered in controllers.
- Every new endpoint gets a **Pest test** in the same PR/commit that introduces it — not after.
- Prefer thin controllers; put business logic (e.g. standings calculation) in service classes or
  actions, not controllers or models.
- Migrations: never edit a migration that's already been merged to `main` — write a new one.

### React (`nextplay-web`)

- TypeScript strict mode — no `any` unless justified with a comment.
- Function components + hooks only.
- Co-locate component tests next to the component (`Component.tsx` + `Component.test.tsx`).
- Tailwind for styling — no separate CSS files per component unless there's a real reason.
- API calls go through `shared/api/` — don't call axios directly from inside feature components.

### Both repos

- **Conventional commits**: `feat:`, `fix:`, `chore:`, `test:`, `refactor:`, `docs:`.
- No direct pushes to `main` — always a PR, even solo. `main` is branch-protected.
- `.gitattributes` present in both repos, normalizing line endings to LF
  (`* text=auto eol=lf`) — don't fight this or add CRLF files.

---

## 6. Environment / Local Setup

**`nextplay-api`**

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nextplay
DB_USERNAME=root
DB_PASSWORD=
```

Run: `php artisan serve` → `http://localhost:8000`

**`nextplay-web`**

```
VITE_API_URL=http://localhost:8000/api
```

Run: `npm run dev` → `http://localhost:5173`

CORS on the API must allow the frontend's local and deployed origins
(`config/cors.php` → `allowed_origins`).

---

## 7. Deployment Targets (context, not necessarily your task)

- Frontend: Vercel or Netlify (free tier).
- Backend: Render (free tier initially — cold starts on idle, acceptable for now), with a planned
  upgrade path to a small VPS (Hetzner/DigitalOcean) once CI/CD is proven out.
- Database: Aiven (always-free MySQL tier).

Don't assume Docker is in use — this project intentionally does **not** use Docker for now
(deferred to a later phase). Don't introduce a `Dockerfile`/`docker-compose.yml` unless asked.

---

## 8. Roadmap / Phase Awareness

Work should track this rough order. If asked to build something from a later phase before an
earlier one is done, flag the sequencing rather than silently doing it:

1. Repo setup, CI skeleton (lint + basic test job)
2. Domain modeling — migrations, seeders, factories
3. Core API — auth, CRUD for seasons/tournaments/teams/players, tests alongside
4. Games, standings, stats (business-logic heavy, needs strong test coverage)
5. CI hardening — required checks, static analysis
6. Public website (React)
7. Admin portal (React)
8. CD — deploy pipelines to staging/prod
9. (Optional/stretch) Live scoring via websockets

---

## 9. Ground Rules for the Agent

- **Ask before**: changing the tech stack, adding new major dependencies, restructuring folders,
  or making architectural decisions not covered in this doc.
- **Never**: commit secrets/`.env` files, disable tests to make CI pass, invent scope not in the
  roadmap without flagging it.
- **Always**: write or update tests for what you touch; keep PRs scoped to one logical change;
  update this file if you make a decision that future-you (or future agent sessions) needs to know.
