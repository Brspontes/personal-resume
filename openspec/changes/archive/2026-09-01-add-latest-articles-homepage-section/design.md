## Context

The `/articles` listing page already fetches published articles server-side via `getPublishedArticles()` and renders them with `ArticleCard`. The homepage (`src/app/page.tsx`) composes independent section components in a fixed order; each section is a Server Component unless it needs client interactivity (e.g., `Header`/`DesktopNav` use `useActiveSection` for scroll-spy). See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Reuse `ArticleCard` and the existing published-article query conventions as-is.
- Keep the new section self-contained: it fetches its own data, the way `/articles/page.tsx` does, rather than having `page.tsx` fetch and pass props down.
- Fail soft: an empty or failed article fetch must never break the rest of the homepage.

**Non-Goals:**
- No changes to the Sanity schema, `ArticleCard`, or article routing.
- No client-side fetching, pagination, or filtering — this is a static top-3 preview.
- No changes to the anchor-based scroll-spy navigation (`useActiveSection`); the section is not added as a nav-menu anchor link, since its purpose is passive discoverability while scrolling, not a navigation target.

## Decisions

**New query function `getLatestArticles(limit)` instead of slicing `getPublishedArticles()` in the component.**
Adds `limit(N)` to the GROQ query so Sanity returns only 3 documents over the wire, rather than fetching every published article and slicing client/server-side. Reuses the existing `PUBLISHED_FILTER` and `ARTICLE_SUMMARY_PROJECTION` constants in `queries.ts`, consistent with how `getFeaturedArticles` is already built from the same building blocks.

**`LatestArticles` is an `async` Server Component that fetches its own data.**
Matches the existing `/articles/page.tsx` pattern and keeps `src/app/page.tsx` a simple, unchanged composition root (no need to make `Home` async or thread props through). No new client-side JavaScript is introduced.

**Failure handling: catch at the section boundary, not with a route-level `error.tsx`.**
`src/app/articles/error.tsx` already handles failures for the dedicated articles route, but the homepage must keep rendering `Hero`, `Skills`, `Contact`, etc. even if the articles fetch fails. `LatestArticles` wraps its `getLatestArticles` call and renders nothing (returns `null`) on failure, instead of letting the error propagate to a route-level error boundary that would blank the whole homepage. This mirrors the "omit the section" option allowed for the empty state.

**Empty/failure state: omit the section rather than show a placeholder.**
Unlike `/articles/page.tsx` (a dedicated page, where an explicit "no articles yet" message is appropriate), a homepage preview section with nothing to preview adds no value and would just be empty chrome above the Contact section. Omitting it entirely keeps the homepage flow clean and satisfies "SHALL NOT display placeholder or fabricated article content."

**Layout: reuse the existing responsive grid pattern from `/articles/page.tsx`** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) rather than inventing a new one, per the project's visual-consistency and no-new-design-system constraints.

## Risks / Trade-offs

[Swallowing the fetch error silently could hide real integration problems] → The catch logs the error server-side (`console.error`) before returning `null`, so failures are still visible in server logs without surfacing to visitors.

[A second query function alongside `getPublishedArticles`/`getFeaturedArticles` slightly grows `queries.ts`] → Accepted: it follows the file's existing one-function-per-retrieval-need convention rather than adding a parameter that changes the meaning of an existing function.
