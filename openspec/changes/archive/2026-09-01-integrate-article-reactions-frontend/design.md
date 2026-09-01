## Context

The backend (`D:\Development\personal-resume-backend`, NestJS + Prisma) is a separate repository, already implemented and running locally at `http://localhost:3001`. Its live OpenAPI document (`GET /api/docs-json`) was inspected directly (not assumed) and confirms the contract this design builds against:

- `GET /api/v1/auth/linkedin?returnTo=<relative-path>` — 302 redirect into LinkedIn's OIDC flow.
- `GET /api/v1/auth/linkedin/callback` — 302 back to the frontend once LinkedIn login completes; sets an httpOnly session cookie on the backend's own origin.
- `GET /api/v1/auth/me` — 200 `CurrentUserDto { id, name, avatarUrl?, email? }`, or 401 if no valid session.
- `POST /api/v1/auth/logout` — 204, clears the session cookie. (Not used by this change; no logout UI exists yet, and none is required by the proposal.)
- `POST /api/v1/articles/{articleId}/reactions` body `{ type: "LIKE" | "DISLIKE" }` — 201 `ReactionSummaryDto { likes, dislikes, userReaction }`. Per the backend's own documented behavior, **resubmitting the visitor's currently active type removes it** — create, change, and remove are all the same endpoint.
- `DELETE /api/v1/articles/{articleId}/reactions` — 204, explicit removal (exists, not needed given the endpoint above already covers removal).
- `GET /api/v1/articles/{articleId}/reactions` — 200 `ReactionSummaryDto`, public: returns `userReaction: null` when unauthenticated instead of erroring.
- `articleId` in all reaction routes is the **Sanity article `_id`** (per the OpenAPI parameter description "Sanity article identifier"), not the route slug. `getArticleBySlug` already returns `_id` on every `ArticleSummary`/`Article`.

The backend and frontend are separate origins in every environment (`localhost:3000`/`3001` in dev today; Vercel/Render in production), confirmed by the backend's own README architecture diagram (direct HTTPS/REST from the Next.js frontend to the NestJS backend — no proxy). This is a cross-origin, credentialed-cookie architecture by design, not something introduced by this change.

**Local environment prerequisite, not part of this change:** the backend's `.env` currently sets `FRONTEND_URL="http://localhost:4200"`, confirmed live via a CORS preflight (`Access-Control-Allow-Origin: http://localhost:4200` regardless of the actual `Origin` sent). That value drives both the backend's CORS allow-list and the post-login redirect target, and does not match this Next.js app's dev origin. Until `FRONTEND_URL` is updated on the backend to match whatever origin this app is run on locally, the browser will reject the cross-origin cookie responses and login redirects will land on the wrong port. This is a one-line backend `.env` change, outside this change's scope (no backend files are touched here) — flagged so it isn't mistaken for a frontend bug during manual testing.

See `proposal.md` - Why, for motivation. See the `linkedin-authentication` and `article-reactions` specs for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Integrate the article page with the existing backend using the smallest reasonable client-side surface.
- Keep the backend the sole source of truth for reaction state and authentication — the frontend never persists or derives either.
- Make the `useCurrentUser` piece reusable by the future Comments feature without building anything Comments-specific now.

**Non-Goals:**
- Building a general account/profile UI, a logout button, or any header auth indicator (not requested; only the reaction flow needs auth state right now).
- Implementing the `DELETE` reactions endpoint — the `POST` endpoint's documented toggle-to-remove behavior already covers every state transition the UI needs, and adding a second removal code path for the same outcome has no behavioral benefit.
- Resuming an in-progress reaction click automatically after a login-redirect round trip. The visitor lands back on the same article, now authenticated, and clicks the reaction again. Auto-resubmitting across a full-page navigation would need extra client-side state (e.g. `sessionStorage`) for a one-extra-click convenience the spec does not require.
- Any change to the backend repository (CORS config included) or to Sanity.

## Decisions

**Codebase inspected before choosing any of the below.** Searched for an existing Axios instance, API service layer, React Query provider/`QueryClient`, `AuthContext`, `useAuth`, or any existing hook/mutation pattern this change could reuse. None exist anywhere in the repository (`package.json` has no `axios` or `@tanstack/react-query`; no `AuthContext`/`useAuth` match anywhere in `src/`). Everything below is therefore a first introduction, not a second implementation of something that already exists.

**Layout under `src/lib/reactions/` and `src/hooks/`, not a `src/features/` tree.**
The proposal's own architecture sketch is explicitly conceptual ("MAY"). This project's actual, established layout is flat (`src/lib/sanity/*`, `src/components/*`, `src/hooks/*`) with no existing `features/` directory anywhere in the codebase. Per CLAUDE.md ("preserve established architectural patterns," "do not introduce new architectural patterns without need"), this change follows the existing flat convention instead:
- `src/lib/reactions/http.ts` — the Axios instance.
- `src/lib/reactions/service.ts` — typed functions wrapping Axios calls (the "Reaction service" / auth service).
- `src/lib/reactions/types.ts` — types mirroring the backend DTOs.
- `src/hooks/useCurrentUser.ts`, `src/hooks/useArticleReactions.ts` — React Query hooks.
- `src/components/ArticleReactions.tsx` — the UI.
- `src/app/articles/providers.tsx` — the `QueryClientProvider` wrapper (see below).

**Axios, via one centralized instance, per explicit direction.** `src/lib/reactions/http.ts` exports a single `axios.create({ baseURL: process.env.NEXT_PUBLIC_REACTIONS_API_URL, withCredentials: true })`. `withCredentials: true` is Axios's equivalent of `fetch`'s `credentials: "include"` — it makes the browser attach the backend's own-origin session cookie automatically; the frontend never reads or touches the cookie's value. `NEXT_PUBLIC_REACTIONS_API_URL` unset is handled once, at the call boundary in `service.ts` (see the "unset base URL" risk below), not by disabling Axios itself.

**TanStack React Query for all server state — `useQuery` for reads, `useMutation` for the reaction write.**
- `useCurrentUser()` wraps `useQuery({ queryKey: ["currentUser"], queryFn: authService.getCurrentUser })`; a 401 resolves the query successfully with `null` (not a thrown error), so "unauthenticated" is a normal, cached data state rather than a query error state.
- `useArticleReactions(articleId)` wraps `useQuery({ queryKey: ["reactions", articleId], queryFn: () => reactionService.getSummary(articleId) })` for the counts/current-reaction read, and a co-located `useMutation({ mutationFn: (type) => reactionService.react(articleId, type) })` for Like/Dislike/remove.
- On the mutation's `onSuccess`, the returned `ReactionSummaryDto` is written directly into the `["reactions", articleId]` query cache via `queryClient.setQueryData` (cheaper and more precise than `invalidateQueries`, since the mutation response already *is* the fresh summary — no extra round trip needed).
- No `onMutate` optimistic write: the query cache is only ever updated from a backend-confirmed response. A failed mutation therefore leaves the cache exactly as it was, which *is* the "revert to last confirmed state" behavior the spec requires — with no separate rollback logic to write or get wrong.
- This cache is the cross-component "server state" the proposal asks for: two components reading `["currentUser"]` (e.g. `ArticleReactions` today, a future `ArticleComments`) share one cached result and one in-flight request, deduplicated by React Query itself.

**No separate `AuthContext`.** A bespoke React Context for the current user would duplicate what the `["currentUser"]` query cache already provides for free (shared, deduplicated, cross-component). Introducing one would be a second implementation of the same cross-component-sharing behavior tests/instructions explicitly guard against ("Não crie uma segunda implementação dessas abstrações sem necessidade").

**`QueryClientProvider` scoped to `src/app/articles/layout.tsx`, not the root `src/app/layout.tsx`.**
`src/app/articles/layout.tsx` is an existing Server Component wrapping every route under `/articles` (listing, detail, and — later — comments) with the shared `Header`/`Footer`. A new `src/app/articles/providers.tsx` (`"use client"`) creates one `QueryClient` per browser session (`useState(() => new QueryClient())`, the standard Next.js App Router pattern) and is inserted around `{children}` in that layout. Reactions (and the future Comments feature) only ever render under `/articles/*`; scoping the provider there keeps the rest of the site (homepage, etc.) completely unaffected by the new dependency.

**Layering — UI components never call Axios directly:**
```text
ArticleReactions
       │
       ▼
useArticleReactions (React Query)
       │
       ▼
reactionService (src/lib/reactions/service.ts)
       │
       ▼
http (Axios instance)
       │
       ▼
Backend API
```
`ArticleReactions` imports only `useArticleReactions`/`useCurrentUser`; it has no import of `axios` or `service.ts`. This mirrors the existing `sanityFetch` → `queries.ts` → components layering already used for Sanity data, applied to this new integration.

**One interaction path for Like/Dislike/Remove: the mutation always sends the clicked type.**
Clicking Like always calls the mutation with `"LIKE"`; clicking Dislike always calls it with `"DISLIKE"`. Because the backend already treats resubmitting the active type as a removal, this single mutation correctly implements create, change, and remove without the frontend tracking or branching on "is this a removal" itself — that decision stays server-side, matching "the backend enforces reaction business rules."

**The click handler checks `useCurrentUser`'s resolved status before calling the mutation.** If status is `"unauthenticated"`, the browser is redirected to the login URL and `mutate()` is never called — no protected request is sent. If status is still `"loading"`, the controls are non-interactive (see the `linkedin-authentication` spec's "Authentication Loading State" requirement) so there is nothing to guard against yet. This is the concrete mechanism behind "the frontend SHALL NOT trigger protected requests unnecessarily when it already knows the visitor is unauthenticated."

**Icons: reuse `react-icons` (already a project dependency), not emoji.**
The proposal's own diagrams use 👍/👎 only as conceptual placeholders. Every existing icon in this codebase (`Skills.tsx`, `ProfessionalExperience`/`ExperienceNavigator`) comes from `react-icons`; the site never uses literal emoji. `FaRegThumbsUp`/`FaThumbsUp` (and the dislike equivalents) from `react-icons/fa` are used instead, with the filled variant indicating the active state — so the selected reaction is distinguished by icon shape *and* an accent-color/label change, not color alone (accessibility requirement).

**Errors are mapped to a small set of generic, pt-BR messages**, surfaced via the mutation's `isError`/`error` state (e.g., an authentication failure mid-mutation → prompts login instead of showing an error; anything else → "Não foi possível registrar sua reação. Tente novamente."), never the raw response body, matching the project's existing error-page copy style (`src/app/articles/error.tsx`).

## Risks / Trade-offs

[Two new runtime dependencies (`axios`, `@tanstack/react-query`) where a zero-dependency `fetch` wrapper would have worked] → Accepted per explicit direction: React Query's cache is what removes the need for a hand-rolled `AuthContext` and manual loading/error/dedup bookkeeping, and both libraries are reused as-is by the future Comments feature rather than adopted for reactions alone.

[Backend `FRONTEND_URL` mismatch blocks local end-to-end testing until fixed] → Documented above and repeated as a manual step in `tasks.md`; not a frontend defect, no frontend workaround attempted (a workaround would mean routing through a same-origin proxy, which contradicts the backend's own documented direct-call architecture).

[Cross-origin cookie behavior in some browsers/privacy modes (e.g. strict third-party-cookie blocking) could prevent the session cookie from being sent even with correct CORS] → Out of this change's control (backend cookie `SameSite`/domain configuration); the UI's existing "unauthenticated" path (prompt to log in) is the same visible behavior a visitor would see, so there is no silent failure mode — worth noting if it surfaces during manual testing, but not a reason to add frontend-side cookie handling.

[No automated tests can exercise a real LinkedIn login] → Tests mock `src/lib/reactions/service.ts` at the module boundary (same "mock at the module boundary" pattern already used for `getLatestArticles` in `LatestArticles.test.tsx`) and render hook/component consumers inside a fresh, `retry: false` `QueryClientProvider` per test, verifying behavior against each documented response shape (200/401/400/network failure) rather than the real backend or real LinkedIn.

[`NEXT_PUBLIC_REACTIONS_API_URL` unset in some environment] → `reactionService`/`authService` treat this the same as Sanity's "not provisioned" case: `ArticleReactions` renders nothing rather than a broken control, so the rest of the article page is unaffected.
