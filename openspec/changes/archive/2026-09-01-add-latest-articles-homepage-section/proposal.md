## Why

The articles section is currently discoverable mainly through site navigation, which collapses into a hidden menu on mobile. This section adds a "Latest Articles" preview to the homepage so the three most recent published articles are visible during normal homepage browsing, on any device, without requiring the visitor to open the mobile menu.

## What Changes

- Add a "Latest Articles" section to the homepage, positioned before the Contact section.
- Add a `getLatestArticles(limit)` query function to the Sanity integration layer that returns published articles ordered by `publishedAt` descending, limited to 3.
- Render the three latest articles using the existing `ArticleCard` component (no new card component needed — it already receives an `ArticleSummary` via props and has no Sanity-specific logic).
- Add a "View all articles" CTA linking to the existing `/articles` listing route.
- Handle empty state (no published articles: section is omitted) and fetch failure (section is omitted; rest of the homepage still renders) gracefully.
- No new client-side JavaScript: the section is an async Server Component, consistent with the existing `/articles` page.

## Capabilities

### New Capabilities
- `latest-articles-section`: A homepage section that previews the three most recent published articles (via the existing Sanity articles integration) and links out to the full articles listing, following the same section-per-capability convention as the other homepage sections (`hero-section`, `professional-highlights`, etc.).

### Modified Capabilities
- `sanity-cms-integration`: Adds a requirement for a query capability that returns the N most recently published articles, reusing the existing published-article filter and summary projection.

## Impact

- `src/lib/sanity/queries.ts`: add `getLatestArticles(limit: number)`.
- `src/components/LatestArticles.tsx` (new): homepage section component, fetches data and renders `ArticleCard` instances plus the CTA.
- `src/app/page.tsx`: render `<LatestArticles />` between `Certifications` and `Contact`.
- No changes to `ArticleCard`, article routing, the `/articles` listing page, or the Sanity schema.
