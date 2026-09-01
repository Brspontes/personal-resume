## 1. Dependencies, Types, and HTTP Client

- [x] 1.1 Add `axios` and `@tanstack/react-query` to `package.json`. (Confirmed by inspection: no existing Axios instance, API service, React Query setup, `AuthContext`, or `useAuth` exists anywhere in the codebase to reuse instead — see `design.md`.)
- [x] 1.2 Add `src/lib/reactions/types.ts` with `CurrentUser`, `ReactionType` (`"LIKE" | "DISLIKE"`), and `ReactionSummary` (`{ likes, dislikes, userReaction }`), mirroring the backend's documented DTOs.
- [x] 1.3 Add `NEXT_PUBLIC_REACTIONS_API_URL` to `.env.example` (blank, documented) and to `.env.local` (pointing at the local backend).
- [x] 1.4 Add `src/lib/reactions/http.ts`: `axios.create({ baseURL: process.env.NEXT_PUBLIC_REACTIONS_API_URL, withCredentials: true })`. `withCredentials: true` makes the browser attach the backend's own-origin session cookie automatically; nothing here reads or stores the cookie or a JWT.
- [x] 1.5 Add `src/lib/reactions/service.ts` with `getCurrentUser()`, `getReactionSummary(articleId)`, and `submitReaction(articleId, type)`, built on the `http` instance, matching the backend's documented endpoints and status codes (401 on `getCurrentUser` → `null`, not a thrown error; other non-2xx → thrown for the caller to handle). Treat an unset `NEXT_PUBLIC_REACTIONS_API_URL` the same as Sanity's "not provisioned" fallback (return the same not-authenticated/empty-summary shape rather than making a request to an empty base URL).
- [x] 1.6 Add `getLoginUrl(returnTo)` in `service.ts`, building the `GET /api/v1/auth/linkedin?returnTo=...` URL from the same base URL. This is a plain URL builder, not an Axios call — the login flow is a full-page navigation, not a fetch.

## 2. Query Client Setup

- [x] 2.1 Add `src/app/articles/providers.tsx` (`"use client"`): creates one `QueryClient` per browser session (`useState(() => new QueryClient())`) and renders `<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>`.
- [x] 2.2 Wrap `{children}` in `src/app/articles/layout.tsx` with `<Providers>`, scoping the query client to the `/articles` route section (where reactions live today and comments will live later) without touching the root `src/app/layout.tsx` or the rest of the site.

## 3. Authentication and Reaction Hooks

- [x] 3.1 Add `src/hooks/useCurrentUser.ts`: wraps `useQuery({ queryKey: ["currentUser"], queryFn: authService.getCurrentUser })` and exposes `{ user, status: "loading" | "authenticated" | "unauthenticated" }` derived from the query's state and data. No separate `AuthContext` — this hook's cache, keyed by `["currentUser"]`, is what makes the resolved auth state shared and deduplicated across every component that calls it (e.g. `ArticleReactions` today, a future `ArticleComments`).
- [x] 3.2 Add `src/hooks/useArticleReactions.ts` for a given `articleId`: a `useQuery({ queryKey: ["reactions", articleId], queryFn: () => reactionService.getReactionSummary(articleId) })` for the summary, and a co-located `useMutation({ mutationFn: (type) => reactionService.submitReaction(articleId, type) })` for the reaction write. On the mutation's `onSuccess`, write the returned summary directly into the `["reactions", articleId]` cache via `queryClient.setQueryData` (no `invalidateQueries` round trip needed — the mutation response already is the fresh summary). Do not implement an `onMutate` optimistic write; a failed mutation should leave the query cache — and therefore the UI — exactly as it was.
- [x] 3.3 Export a combined `{ summary, react, isReacting, reactionError }`-shaped result from `useArticleReactions` for `ArticleReactions` to consume, so the component never imports React Query, the service, or Axios directly.

## 4. Reaction UI

- [x] 4.1 Add `src/components/ArticleReactions.tsx` (Client Component) accepting `{ articleId, articleSlug }`; it calls only `useCurrentUser` and `useArticleReactions`.
- [x] 4.2 Render Like/Dislike controls with the counts and current-reaction state from `useArticleReactions`'s summary.
- [x] 4.3 While `useCurrentUser`'s status is `"loading"`, render the controls in a neutral (non-reacted, non-interactive) loading state; do not assume authenticated or unauthenticated.
- [x] 4.4 Click handler: if `useCurrentUser`'s status is `"unauthenticated"`, navigate the browser to `getLoginUrl(currentArticlePath)` and do not call the mutation — no reaction request is sent. If `"authenticated"`, call the mutation with the clicked type.
- [x] 4.5 While the mutation is pending (`isReacting`), show a busy state on the clicked control and ignore repeated clicks on it — React Query's own pending state, not extra local flags, drives this.
- [x] 4.6 On mutation error, show a generic inline error message derived from `reactionError` (no raw error text); the displayed summary is whatever remains in the query cache (the last confirmed state, per the no-optimistic-write decision).
- [x] 4.7 Use `react-icons/fa` (`FaRegThumbsUp`/`FaThumbsUp`, `FaRegThumbsDown`/`FaThumbsDown` or equivalent) to distinguish the active reaction by icon plus an accent-color/label change, not color alone. Give each control an accessible name that reflects its current action (e.g. "Like article" vs "Remove like").
- [x] 4.8 Style the section using the project's existing spacing/typography/border conventions (see `ArticleCard.tsx`, `Contact.tsx` for the established patterns); ensure controls are comfortably tappable on mobile widths.
- [x] 4.9 While `useCurrentUser`'s status is `"unauthenticated"`, render a visible notice near the controls stating that LinkedIn authentication is required and that clicking will redirect to login, so the redirect in 4.4 is expected rather than a surprise. Hidden for `"authenticated"`/`"loading"`.

## 5. Article Page Integration

- [x] 5.1 Render `<ArticleReactions articleId={article._id} articleSlug={article.slug} />` in `src/app/articles/[slug]/page.tsx`, after the article body/tags block.

## 6. Tests

- [x] 6.1 `src/__tests__/lib/reactions/service.test.ts`, mocking `src/lib/reactions/http.ts`'s Axios instance: `getCurrentUser` maps a 401 to `null` without throwing; `submitReaction`/`getReactionSummary` parse successful responses and surface failures for the caller to handle; behavior when `NEXT_PUBLIC_REACTIONS_API_URL` is unset matches the documented fallback.
- [x] 6.2 `src/__tests__/hooks/useCurrentUser.test.tsx`, mocking `authService.getCurrentUser` and rendering the hook inside a fresh `QueryClientProvider` (`retry: false`): resolves to `authenticated` with the user on success, `unauthenticated` on a `null` result, starts in `loading`.
- [x] 6.3 `src/__tests__/hooks/useArticleReactions.test.tsx`, mocking `reactionService`, rendered inside a fresh `QueryClientProvider`: the summary query reflects the mocked response; a successful mutation updates the `["reactions", articleId]` cache without a follow-up fetch; a failed mutation leaves the cache (and therefore `summary`) unchanged.
- [x] 6.4 `src/__tests__/components/ArticleReactions.test.tsx`, mocking `useCurrentUser` and `useArticleReactions` (component-level unit tests, not the hooks' own React Query wiring — already covered above), covering:
  - renders the current counts and the visitor's existing reaction from the initial summary
  - authenticated visitor can Like an article (no prior reaction)
  - authenticated visitor can switch from Like to Dislike, and the UI never shows both as active
  - authenticated visitor can remove an active reaction by selecting it again
  - unauthenticated visitor selecting a reaction is redirected to the login URL instead of calling the mutation
  - a reaction control is disabled/busy while `isReacting` is true, and a second click during that window does not trigger a second call
  - when `reactionError` is set, the UI shows a generic error, not raw error text, and displays the summary as given (last confirmed state)
  - reaction controls have accessible names and are operable via keyboard

## 7. Verification

- [x] 7.1 Run `npm run build`, `npm run lint`, and `npm test`; fix any errors.
- [x] 7.2 Manual local verification against the real local backend (its `FRONTEND_URL` was found already updated to match this app's origin, resolving the prerequisite noted in `design.md`). Verified against real network calls: unauthenticated view of an article (public GET summary renders); Like on an authenticated session (POST 201, count updates); switch Like → Dislike (POST 201, only one ever shown active); remove via re-click (POST 201, back to no reaction); logging out and clicking a control correctly redirects to the real LinkedIn login URL with the right `returnTo`. Not verified live: completing a real LinkedIn login and landing back authenticated (would require entering real LinkedIn credentials, which this session does not do), and a live simulated request failure (covered instead by the automated `reactionError` tests). Also found: the backend's `LINKEDIN_CALLBACK_URL` is set to port 3000 (this frontend's port) instead of the backend's own port 3001, which would break the final leg of a real login redirect back from LinkedIn — a backend-side config issue, out of this change's scope, flagged for the user.
- [x] 7.3 Manually verified keyboard operability: focused a reaction control and activated it with Enter, producing the same behavior as a pointer click. Did not visually confirm the mobile-width layout in this session (the browser tool's viewport resize had no visible effect here); the controls use the same responsive `flex-wrap` + compact padding pattern already established by `ArticleCard`/`Contact`, but this is a gap versus a full manual confirmation.
- [x] 7.4 Run `openspec validate --change integrate-article-reactions-frontend --strict` and fix any reported issues.
