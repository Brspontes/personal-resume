## 1. Sanity Query Layer

- [x] 1.1 Add `getLatestArticles(limit: number): Promise<ArticleSummary[]>` to `src/lib/sanity/queries.ts`, reusing `PUBLISHED_FILTER` and `ARTICLE_SUMMARY_PROJECTION`, ordered by `publishedAt desc` and capped with GROQ `[0...limit]`.

## 2. LatestArticles Section Component

- [x] 2.1 Create `src/components/LatestArticles.tsx` as an async Server Component that calls `getLatestArticles(3)`.
- [x] 2.2 Wrap the fetch in a try/catch; on failure, `console.error` the error and return `null` (render nothing).
- [x] 2.3 If the result is empty, return `null` (render nothing) instead of an empty section shell.
- [x] 2.4 Render a section heading ("Latest Articles" / project's existing copy language) using the homepage's established heading and spacing conventions (see `ProfessionalHighlights.tsx` / `articles/page.tsx` for the pattern).
- [x] 2.5 Render the fetched articles using the existing `ArticleCard` component in a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, matching `/articles/page.tsx`).
- [x] 2.6 Add a "View all articles" CTA linking to `/articles` with a clear accessible name.

## 3. Homepage Integration

- [x] 3.1 Import and render `<LatestArticles />` in `src/app/page.tsx`, positioned between `Certifications` and `Contact`.

## 4. Verification

- [x] 4.1 Run `npm run build` and `npm run lint`; fix any TypeScript or lint errors.
- [x] 4.2 Manually verify in the browser: section renders with 3 latest articles, ordered newest-first. (Only 1 published article exists in Sanity currently; verified the section correctly renders that single article per the "fewer than three" requirement instead of fabricating placeholders.)
- [x] 4.3 Manually verify article card links navigate to the correct `/articles/[slug]` route, and the CTA navigates to `/articles`.
- [x] 4.4 Manually verify responsive behavior at mobile, tablet, and desktop widths, and confirm the section is visible while scrolling the homepage without opening the mobile nav menu.
- [x] 4.5 Verify keyboard navigation and focus states on article cards and the CTA.
- [x] 4.6 Run `openspec validate --change add-latest-articles-homepage-section --strict` and fix any reported issues.
