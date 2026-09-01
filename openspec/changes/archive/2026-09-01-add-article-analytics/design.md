## Context

The backend's live OpenAPI document (`GET /api/docs-json` at `http://localhost:3000`) was inspected directly and confirms the contract this design builds against:

- `POST /api/v1/analytics/events` — body `RecordAnalyticsEventDto { event: "ARTICLE_VIEW" | "ARTICLE_PROGRESS" | "ARTICLE_READ", articleId: string, sessionId: string, progress?: 25|50|75|90, duration?: number (0-86400s), maxProgress?: number (0-100) }`. `progress` is required only for `ARTICLE_PROGRESS`; `duration`/`maxProgress` only for `ARTICLE_READ`. Responses: 204 (accepted, persisted or ignored as a duplicate), 400 (invalid payload), 429 (rate limited). No authentication required; the endpoint's summary states it "associates the event with the caller when a valid session is present" — the backend reads this from the same session cookie already sent automatically by the shared Axios client's `withCredentials: true`, with no frontend-side work needed.
- `articleId` is the Sanity article `_id`, matching the convention already established by reactions and comments.

See `proposal.md` - Why, for motivation, and `specs/article-analytics/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Reuse every convention already established by reactions/comments (shared Axios client at `@/lib/backend/http`, service-layer isolation, "renders nothing, just runs an effect" component shape from `BackendWarmup`).
- Keep the implementation simple: one scroll-based progress calculation, one visibility-aware timer, no new dependency.

**Non-Goals:**
- A React Query layer for analytics events — the proposal explicitly calls these write-only telemetry, not cached server state.
- Any analytics dashboard or aggregation UI (backend-side, out of scope per the proposal's Non-Goals).
- Sentinel-element-based (`IntersectionObserver` positioned at exact content offsets) progress detection — see Decisions below for why a single scroll calculation was chosen instead.
- A logout/account-level analytics opt-out UI (not requested; the session id is anonymous and unlinked to identity by design).

## Decisions

**Module layout mirrors `src/lib/reactions/` and `src/lib/comments/`:**
- `src/lib/analytics/types.ts` — `AnalyticsEvent` (the DTO shape) and a narrower per-call-site type for each `track*` function's parameters.
- `src/lib/analytics/service.ts` — `getOrCreateSessionId()`, `trackArticleView(articleId)`, `trackArticleProgress(articleId, sessionId, progress)`, `trackArticleRead(articleId, sessionId, duration, maxProgress)`, all built on `@/lib/backend/http`. Each `track*` catches and swallows its own errors (matching `BackendWarmup`'s pattern) so a caller never needs a try/catch.
- `src/hooks/useArticleAnalytics.ts` — the one hook owning session id, view/progress/read lifecycle, the scroll listener, and the visibility-aware timer.
- `src/components/ArticleAnalytics.tsx` — a client component that renders `null`, matching `BackendWarmup`'s shape; its entire body is `useArticleAnalytics(articleId)`.

**Anonymous session id stored in `localStorage`, generated with `crypto.randomUUID()`.** The proposal leaves the storage mechanism open ("SHOULD use an appropriate browser storage mechanism"). `localStorage` (not `sessionStorage`) is chosen because the spec's own scenario ("visitor already has an analytics session" when opening *another* article) implies persistence beyond a single article view; `sessionStorage` would also reset on every new tab, undercounting a visitor who opens articles in multiple tabs across a browsing session. The id itself is an opaque random UUID with no relationship to the LinkedIn account, satisfying "SHALL NOT use the LinkedIn user id."

**Progress calculation: a single scroll-position formula against the article-content element, not `IntersectionObserver` sentinels.** The article content wrapper (`<div className="mt-8">` around `<ArticleBody />` in `src/app/articles/[slug]/page.tsx`) gets a stable `id="article-content"`. On scroll (listener attached with `{ passive: true }`, throttled via `requestAnimationFrame` so at most one calculation runs per frame), the hook computes how far the visitor has scrolled through that element's height (`(viewportBottom - elementTop) / elementHeight`, clamped to 0-100) and checks it against the milestone list. This was chosen over inserting invisible sentinel elements at exact 25/50/75/90% offsets inside the Portable-Text-rendered content (which `ArticleBody` doesn't control the internal structure of in a way that makes precise sentinel placement straightforward) — a single formula against the container's own `getBoundingClientRect()` needs no changes to `ArticleBody` itself and is simpler to reason about and test.

**Active reading timer: `Date.now()` deltas gated by `document.visibilityState`, not `setInterval`.** On mount, if the tab is visible, record a `visibleSince` timestamp; on every `visibilitychange`, when going hidden, add `Date.now() - visibleSince` to an accumulated total and clear `visibleSince`; when becoming visible again, set a new `visibleSince`. The final duration (sent with `ARTICLE_READ`) is the accumulated total plus any currently-open visible span. This avoids a running `setInterval` (which would tick uselessly while the tab is hidden and serves no purpose other than updating a number nothing displays) in favor of a handful of timestamp subtractions computed only when needed.

**`ARTICLE_READ` is sent from two triggers, guarded so it only fires once per reading session: the hook's cleanup function (covers client-side navigation to a different article, since `articleId` changing re-runs the effect) and a `visibilitychange` listener that fires it when the tab becomes hidden** (covers closing the tab or switching away, which is more reliable across browsers than `beforeunload`, especially on mobile). A `hasSentReadRef` flag prevents double-sending if both triggers occur close together (e.g., hiding the tab right before navigating away). Delivery uses `navigator.sendBeacon` when available (fire-and-forget, survives page unload, and the browser attaches the destination-origin cookie the same as a normal request) with the existing Axios call as the fallback when `sendBeacon` is unavailable or its enqueue call returns `false` — matching the proposal's explicit allowance for `sendBeacon` on this specific event while keeping Axios as the default elsewhere.

**No client-side "did this article already get a view this session" gate.** The spec and the backend's own documented behavior both place deduplication authority with the backend ("ignored as a duplicate" is a valid 204 outcome); the hook simply sends one `ARTICLE_VIEW` per mount (i.e., once per page load of that article), which is the same "one request per distinct event" guarantee already required for progress and read events, without adding a second, redundant deduplication mechanism the spec explicitly says not to rely on.

**Milestone tracking uses a `Set<number>` of already-sent milestones, reset whenever `articleId` changes** (new `Set` created inside the effect that depends on `[articleId]`), directly satisfying "no reuse of the previous article's progress" and "no duplicate milestone" requirements with the simplest possible data structure.

## Risks / Trade-offs

[`navigator.sendBeacon` payload size and content-type support vary slightly across older browsers] → A `Blob` with an explicit `application/json` type is used (supported broadly in current browsers); if `sendBeacon` is unavailable or its call returns `false` (queue full), the code falls back to a normal (best-effort, unawaited) Axios POST, so delivery is attempted either way.

[Scroll-based progress can behave unpredictably on very short articles where the content area is shorter than the viewport] → The formula clamps to the 0-100 range and a very short article simply reaches 90%+ progress almost immediately after the view event, which is the correct behavior (the visitor genuinely sees "the whole article" right away) rather than an edge case needing special-casing.

[A visitor with `localStorage` disabled or in a strict privacy mode never gets a stable session id] → `getOrCreateSessionId` falls back to generating a fresh in-memory id for that page load if `localStorage` throws (matching the try/catch pattern already used for backend-unavailable fallbacks elsewhere); analytics for that visitor is simply less able to be correlated across page loads, which is an acceptable degradation, not a functional break.

[Adding an `id` attribute to the existing article-content wrapper is a (very small) change to already-shipped markup] → No visual or behavioral change; verified by re-running the existing article page test coverage after the change.
