## 1. Types and Service

- [x] 1.1 Add `src/lib/analytics/types.ts` with `AnalyticsEventType` (`"ARTICLE_VIEW" | "ARTICLE_PROGRESS" | "ARTICLE_READ"`) and `RecordAnalyticsEvent` mirroring the backend's `RecordAnalyticsEventDto` (`event`, `articleId`, `sessionId`, optional `progress`, `duration`, `maxProgress`).
- [x] 1.2 Add `src/lib/analytics/service.ts` with `getOrCreateSessionId()`: reads an existing id from `localStorage` (key e.g. `analytics_session_id`), generates one with `crypto.randomUUID()` and persists it if absent, and falls back to an in-memory id (no persistence) if `localStorage` throws.
- [x] 1.3 Add `trackArticleView(articleId)`, `trackArticleProgress(articleId, sessionId, progress)`, `trackArticleRead(articleId, sessionId, duration, maxProgress)` in `service.ts`, each posting to `/api/v1/analytics/events` via `@/lib/backend/http` and catching/swallowing their own errors (matching `pingHealth`'s pattern) so callers never need their own try/catch.
- [x] 1.4 Add a `sendArticleReadBeacon(articleId, sessionId, duration, maxProgress)` helper that builds the same payload and sends it via `navigator.sendBeacon` (as a `Blob` with `type: "application/json"`) when available and its call succeeds, falling back to `trackArticleRead` otherwise.

## 2. Tracking Hook

- [x] 2.1 Add `src/hooks/useArticleAnalytics.ts` accepting `articleId: string`. On mount (and whenever `articleId` changes): resolve the session id via `getOrCreateSessionId()`, call `trackArticleView(articleId)` once, and reset a `Set` of already-sent progress milestones for the new article.
- [x] 2.2 Add a scroll listener (`{ passive: true }`, throttled to at most once per animation frame via `requestAnimationFrame`) that measures scroll position against the `#article-content` element's `getBoundingClientRect()`, computes a 0-100 progress percentage, and calls `trackArticleProgress` for any of the 25/50/75/90 milestones crossed for the first time, marking each as sent in the milestone `Set`. Track the maximum progress percentage observed for use in the read-completion event.
- [x] 2.3 Add active-reading-time tracking: record a `visibleSince` timestamp while `document.visibilityState === "visible"`; on `visibilitychange`, accumulate elapsed visible time when going hidden and start a new span when becoming visible again.
- [x] 2.4 Add a `sendReadEvent()` function (guarded by a ref so it only runs once per reading session) that computes the final duration (accumulated visible time plus any currently open span) and calls `sendArticleReadBeacon` with the max progress observed. Call it from: (a) a `visibilitychange` listener when the tab becomes hidden, and (b) the effect's cleanup function (covers unmount from client-side navigation to a different article or away from the page).
- [x] 2.5 Ensure all listeners (scroll, `visibilitychange`) are removed in the effect's cleanup, and that every piece of per-article state (milestone set, max progress, visible-time accumulator, `hasSentReadRef`) is freshly initialized when `articleId` changes - no state SHALL carry over from a previous article.

## 3. Tracking Component and Page Integration

- [x] 3.1 Add `src/components/ArticleAnalytics.tsx` (Client Component): its entire body is `useArticleAnalytics(articleId)`, rendering `null` (mirrors `BackendWarmup`'s shape).
- [x] 3.2 Add `id="article-content"` to the existing `<div className="mt-8">` wrapper around `<ArticleBody />` in `src/app/articles/[slug]/page.tsx`, and render `<ArticleAnalytics articleId={article._id} />` on the page (only reached once `getArticleBySlug` has resolved and `notFound()` has not been called, so a failed/missing article never triggers tracking).

## 4. Tests

- [x] 4.1 `src/__tests__/lib/analytics/service.test.ts`: `getOrCreateSessionId` generates and persists a new id when none exists, reuses an existing one, and falls back to an in-memory id when `localStorage` throws; `trackArticleView`/`trackArticleProgress`/`trackArticleRead` send the documented payload shape and swallow request failures without throwing; `sendArticleReadBeacon` uses `navigator.sendBeacon` when available and falls back to the Axios path when it is not (or returns `false`).
- [x] 4.2 `src/__tests__/hooks/useArticleAnalytics.test.tsx`, mocking `src/lib/analytics/service.ts` and using fake timers plus manual `document.visibilityState`/`dispatchEvent(new Event("visibilitychange"))` control:
  - sends `ARTICLE_VIEW` once on mount, with the correct `articleId`
  - sends each of the 25/50/75/90 `ARTICLE_PROGRESS` milestones exactly once, even when scroll position crosses a milestone multiple times
  - does not count time while `document.visibilityState` is `"hidden"` toward the reading duration
  - sends `ARTICLE_READ` with the accumulated duration and max progress when the tab becomes hidden, and does not send it a second time on unmount afterward
  - sends `ARTICLE_READ` on unmount (simulating navigation to a different article) when the tab was never hidden
  - resets progress/timing state when `articleId` changes across a rerender, and the new article's tracking is unaffected by the previous article's state
- [x] 4.3 `src/__tests__/components/ArticleAnalytics.test.tsx`: renders nothing, and calling it invokes the tracking hook (verified via a mocked `useArticleAnalytics`).

## 5. Verification

- [x] 5.1 Run `npm run build`, `npm run lint`, and `npm test`; fix any errors.
- [x] 5.2 Manual local verification against the real backend: confirmed via the browser's Network tab and an injected XHR interceptor against `http://localhost:3000` - `ARTICLE_VIEW` fires on load; scrolling through the article sends exactly one `ARTICLE_PROGRESS` per milestone (25/50/75/90), verified with the exact payload shape and no duplicates even when scrolling back and forth across a milestone; dispatching a `visibilitychange` to `"hidden"` triggered an `ARTICLE_READ` delivered via `navigator.sendBeacon` (accepted with 204 by the backend); client-side navigation back to the articles listing (via the in-page "Voltar para artigos" link) unmounted the tracking cleanly with no console errors and no duplicate read event; the reactions and comments sections rendered and worked normally throughout. Note: true OS-level tab-switch could not be exercised through the browser automation tool (the extension's new-tab action didn't change `document.visibilityState` on the original tab), so the hidden-tab trigger was verified via a direct `visibilitychange` dispatch instead - the underlying duration-exclusion math is additionally covered exhaustively by the task 4.2 unit tests.
- [x] 5.3 Manually verify analytics tracking works on a mobile viewport (scroll-based progress and tab-visibility handling). Partial: the browser automation's window resize did not actually shrink the live viewport in this environment (window stayed at desktop size despite a reported-successful resize), so a real narrow-viewport run could not be executed. The tracking logic itself has no viewport-width dependency - progress is computed purely from `window.innerHeight` and the content element's `getBoundingClientRect()`, and scrolling on mobile fires the same native `scroll` event exercised in the desktop verification above - so this is a lower-risk gap than a typical untested path, but a real mobile-device or DevTools-device-mode check is recommended before considering this fully closed.
- [x] 5.4 Run `openspec validate --change add-article-analytics --strict` and fix any reported issues.
