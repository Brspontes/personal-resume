# Personal Resume

[![CI](https://github.com/Brspontes/personal-resume/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Brspontes/personal-resume/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Node](https://img.shields.io/badge/node-24.19.0-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vercel Deploy](https://img.shields.io/github/deployments/Brspontes/personal-resume/production?label=vercel&logo=vercel&logoColor=white)](https://brianpontes.dev)
[![Last commit](https://img.shields.io/github/last-commit/Brspontes/personal-resume?logo=github)](https://github.com/Brspontes/personal-resume/commits/master)

Personal resume and professional portfolio website, built to present professional experience, skills, and career history in a modern, developer-styled web interface. Includes an Articles section backed by Sanity CMS, with LinkedIn-authenticated reactions, comments, and anonymous reading analytics powered by a companion backend.

**Live:** [brianpontes.dev](https://brianpontes.dev)

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-icons](https://react-icons.github.io/react-icons/) for technology logos
- [Sanity](https://www.sanity.io/) as the headless CMS for article content
- [Axios](https://axios-http.com/) + [TanStack Query](https://tanstack.com/query) for the reactions/comments/analytics backend integration
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) for unit tests

## Getting Started

Requires Node.js `24.19.0` (see `engines` in `package.json`).

```bash
npm install
cp .env.example .env.local   # fill in the values you need (see below)
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the site.

### Other scripts

```bash
npm run build       # production build
npm run start       # serve the production build
npm run lint        # run ESLint
npm test             # run the unit test suite once
npm run test:watch    # run the unit test suite in watch mode
```

### Environment Variables

See `.env.example` for the full list. Every integration degrades gracefully when its variables are unset — the site still runs, just without that feature:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base URL used to resolve canonical/Open Graph URLs. Defaults to `https://brianpontes.dev` if unset. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Sanity project powering the Articles section. Unset → the Articles section renders empty. |
| `SANITY_API_VERSION`, `SANITY_API_READ_TOKEN` | Sanity API version pin and an optional read token, only needed for a private dataset. |
| `NEXT_PUBLIC_REACTIONS_API_URL` | Base URL of [personal-resume-backend](https://github.com/Brspontes/personal-resume-backend) — LinkedIn auth, article reactions, comments, and reading analytics. Unset → those features are hidden. |

## Project Structure

```
src/
  app/
    layout.tsx, page.tsx, globals.css   # root layout + homepage
    articles/
      page.tsx                            # articles listing (Sanity-backed)
      layout.tsx, providers.tsx            # scopes the TanStack Query provider to /articles
      [slug]/page.tsx                       # article detail: body, reactions, comments, analytics
  components/    # presentational + client components (Hero, Skills, ArticleReactions, ArticleComments, ...)
  hooks/          # data/behavior hooks (useCurrentUser, useArticleReactions, useArticleComments, useArticleAnalytics, ...)
  lib/
    sanity/         # Sanity client, GROQ queries, types
    backend/         # shared Axios client for the reactions/comments/analytics backend
    reactions/, comments/, analytics/   # per-feature service layer (HTTP calls, DTOs)
    format.ts         # date/reading-time formatting helpers
  data/
    profile.ts         # resume content — experience, skills, education, certifications
  __tests__/    # Vitest + React Testing Library specs, mirroring src/
```

Resume content lives in `src/data/profile.ts`, sourced from the developer's actual resume; article content is authored in Sanity. Components are presentation-only over this data.

## Article Features

Articles are fetched directly from Sanity. Reactions, comments, and reading analytics are wired to a separate backend ([personal-resume-backend](https://github.com/Brspontes/personal-resume-backend), NestJS + Prisma):

- **Reactions & comments** require LinkedIn login (OpenID Connect), handled entirely by the backend via an httpOnly session cookie — the frontend never sees a token.
- **Reading analytics** (views, scroll-based reading progress, active reading time) are anonymous and authentication-independent, identified only by a session id stored in the visitor's browser.
- Every backend call goes through a single shared Axios client (`src/lib/backend/http.ts`); reactions/comments use TanStack Query for cached server state, while analytics events are write-only telemetry sent directly through the service layer.

## OpenSpec Workflow

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) for spec-driven change planning. Proposed and completed changes live under `openspec/`:

- `openspec/specs/` — current capability specs (source of truth for behavior)
- `openspec/changes/` — active change proposals
- `openspec/changes/archive/` — completed, archived changes
