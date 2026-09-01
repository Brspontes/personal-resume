## Why

The backend now exposes an anonymous article analytics endpoint — confirmed live against its OpenAPI document (`GET /api/docs-json`) at `http://localhost:3000`: `POST /api/v1/analytics/events`, accepting `ARTICLE_VIEW`, `ARTICLE_PROGRESS`, and `ARTICLE_READ` events, unauthenticated by design (it associates the event with the caller only when a session cookie happens to be present). This change wires the article detail page to that endpoint so article consumption (views, reading progress, active reading time) can be measured for every visitor, not just the ones who react or comment.

## What Changes

- Generate and persist an opaque, anonymous analytics session id in the browser (not derived from the LinkedIn session), reused across the visitor's browsing.
- Send `ARTICLE_VIEW` once an article has successfully rendered.
- Track reading progress against the article's own content area and send `ARTICLE_PROGRESS` at the 25/50/75/90% milestones, each at most once per reading session.
- Track active reading time (paused while the tab is hidden) and send a final `ARTICLE_READ` (with `duration` and `maxProgress`) when the visitor leaves the article or navigates to a different one.
- Add `src/lib/analytics/{types,service}.ts` (Axios via the existing shared `@/lib/backend/http` client — no React Query, since these are write-only telemetry events, not cached server state) and a `useArticleAnalytics(articleId)` hook encapsulating session id, view/progress/read tracking, and the visibility-aware timer.
- Add an invisible `ArticleAnalytics` component (mirrors `BackendWarmup`'s "renders nothing, just runs an effect" shape) rendered on the article detail page.
- Add a stable `id` to the existing article-content wrapper in `src/app/articles/[slug]/page.tsx` so the tracking hook can measure scroll progress against that specific element instead of the whole page.

## Capabilities

### New Capabilities
- `article-analytics`: Anonymous, authentication-independent tracking of article views, reading progress, and active reading time, sent to the backend's analytics endpoint without affecting article rendering or the visitor's experience.

### Modified Capabilities
_None._ Existing capabilities (`articles`, `article-reactions`, `article-comments`, `linkedin-authentication`) are unaffected — analytics is purely additive telemetry alongside them, reusing the shared HTTP client without touching their behavior.

## Impact

- `src/app/articles/[slug]/page.tsx`: renders `<ArticleAnalytics articleId={article._id} />`; the existing article-content wrapper `<div className="mt-8">` around `<ArticleBody />` gains an `id` for progress measurement.
- `src/lib/analytics/types.ts` (new): `AnalyticsEvent` type mirroring the backend's `RecordAnalyticsEventDto`.
- `src/lib/analytics/service.ts` (new): `trackArticleView`, `trackArticleProgress`, `trackArticleRead`, `getOrCreateSessionId`.
- `src/hooks/useArticleAnalytics.ts` (new): the tracking hook.
- `src/components/ArticleAnalytics.tsx` (new): the invisible tracking component.
- No changes to the backend repository, to Sanity, or to reactions/comments behavior.
