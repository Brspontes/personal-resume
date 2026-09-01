## Why

The standalone backend (`personal-resume-backend`, NestJS + Prisma, running locally at `http://localhost:3001`) already implements LinkedIn login, cookie-based sessions, and article reactions (like/dislike, one per user per article, toggle-to-remove), confirmed against its live OpenAPI document (`GET /api/docs-json`). None of this is wired into the frontend yet. This change integrates the individual article page with that existing backend so visitors can like or dislike an article, without duplicating any of the authentication or reaction rules the backend already enforces.

## What Changes

- Add a reaction control (Like/Dislike) to the individual article detail page (`/articles/[slug]`).
- Add a centralized Axios instance for the backend's `/api/v1` REST endpoints (auth + reactions), plus a thin service layer of typed functions built on it. No existing Axios instance, API service, or React Query setup was found in the codebase to reuse (confirmed by inspection — see `design.md`).
- Add TanStack React Query (`useQuery` for reads, `useMutation` for the reaction write) as the server-state layer on top of that service, scoped to the `/articles` route section via a new `QueryClientProvider`.
- Add a `useCurrentUser` hook (backed by a `useQuery` on the shared query cache, not a bespoke `AuthContext`) that resolves the visitor's authentication state via `GET /api/v1/auth/me` (cookie session, resolved client-side since the session cookie lives on the backend's own origin).
- Add an `ArticleReactions` component: reads the article's reaction summary (`GET /api/v1/articles/{articleId}/reactions`, public) via a `useArticleReactions` hook, and — for authenticated visitors — lets them Like, Dislike, or remove their reaction by resubmitting the active type (`POST /api/v1/articles/{articleId}/reactions`), consistent with the backend's documented toggle-to-remove semantics. The component calls only the reaction/auth hooks, never Axios directly.
- When an unauthenticated visitor tries to react, redirect the full page to the backend's LinkedIn login endpoint (`GET /api/v1/auth/linkedin?returnTo=<current article path>`), which redirects back to this same article page once LinkedIn login completes.
- Add `NEXT_PUBLIC_REACTIONS_API_URL` as a new environment variable (documented in `.env.example`), following the existing pattern for optional, gracefully-degrading external integrations: if unset, the reaction section does not render, the rest of the article page is unaffected.

## Capabilities

### New Capabilities
- `linkedin-authentication`: Frontend integration with the backend's existing LinkedIn OpenID Connect session (login redirect, current-user resolution, logout), reusable by any future feature that needs to know whether the visitor is signed in.
- `article-reactions`: The Like/Dislike UI on the article detail page and its integration with the backend's reactions endpoints, including reaction counts, the visitor's current reaction, loading states, and error handling.

### Modified Capabilities
_None._ The existing `articles` capability (Sanity-sourced content, routing, SEO) is unchanged; reactions are additive UI on the same page and do not alter how article content is retrieved or rendered.

## Impact

- `src/app/articles/[slug]/page.tsx`: renders `<ArticleReactions articleId={article._id} articleSlug={article.slug} />` after the article body/tags.
- `src/app/articles/layout.tsx`: wraps `{children}` in the new `<Providers>` (`QueryClientProvider`).
- `src/app/articles/providers.tsx` (new): the `QueryClientProvider` wrapper, scoped to the `/articles` route section.
- `src/lib/reactions/http.ts` (new): the centralized Axios instance (`baseURL` from `NEXT_PUBLIC_REACTIONS_API_URL`, `withCredentials: true`).
- `src/lib/reactions/service.ts` (new): typed functions (`getCurrentUser`, `getReactionSummary`, `submitReaction`, `getLoginUrl`) wrapping the Axios instance.
- `src/lib/reactions/types.ts` (new): TypeScript types mirroring the backend's documented DTOs (`CurrentUserDto`, `CreateReactionDto`, `ReactionSummaryDto`).
- `src/hooks/useCurrentUser.ts` (new): `useQuery`-backed authentication state, shared across consumers via the React Query cache.
- `src/hooks/useArticleReactions.ts` (new): `useQuery` (summary) + `useMutation` (react) for a given article.
- `src/components/ArticleReactions.tsx` (new): the reaction UI (Client Component); calls only the hooks above.
- `package.json`: add `axios` and `@tanstack/react-query` as dependencies.
- `.env.example` / `.env.local`: add `NEXT_PUBLIC_REACTIONS_API_URL`.
- No changes to the backend repository, to Sanity, to the articles listing page, or to comments (out of scope, tracked separately).

**Local environment note:** the backend's current `.env` sets `FRONTEND_URL="http://localhost:4200"`, which drives both its CORS allow-list and its post-login redirect target. It does not match this Next.js app's dev origin. Manual end-to-end testing of login/reactions will require updating that value on the backend side first; this is called out as a prerequisite in `design.md` and is not part of this change's scope (no backend files are touched here).
