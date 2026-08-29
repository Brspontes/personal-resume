## 1. Dependencies and Configuration

- [x] 1.1 Add `next-sanity` and `@portabletext/react` to `package.json`.
- [x] 1.2 Document required environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_VERSION`, and a read token if the dataset is private) in `.env.local.example` (or equivalent) without committing real values.
- [x] 1.3 Add `cdn.sanity.io` to `images.remotePatterns` in `next.config.ts`.

## 2. Sanity Data Access Layer

- [x] 2.1 Create `src/lib/sanity/client.ts` reading project ID, dataset, and API version from environment variables.
- [x] 2.2 Create `src/lib/sanity/types.ts` with an `Article` type covering title, slug, excerpt, cover image, publication date, category, tags, reading time, featured flag, rich text body, and author.
- [x] 2.3 Create `src/lib/sanity/queries.ts` with dedicated GROQ queries for: published articles (ordered by publication date), featured articles, article by slug, categories, and tags — each filtered to published, non-draft content only.
- [x] 2.4 Configure fetch-based revalidation (time-based) for the queries per design.md.

## 3. Navigation

- [x] 3.1 Extend the `NAV_LINKS` shape in `Header.tsx` with a `kind: "hash" | "route"` discriminator, marking existing links `"hash"`.
- [x] 3.2 Add an "Articles" entry (`kind: "route"`, `href: "/articles"`) to `NAV_LINKS`.
- [x] 3.3 Update `DesktopNav.tsx` and `MobileNav.tsx` to render `"route"` links as plain `next/link` navigation, leaving `"hash"` link behavior (including `useActiveSection`) unchanged.

## 4. Articles Listing Page

- [x] 4.1 Create `src/app/articles/page.tsx` as a Server Component fetching published articles via the Sanity data access layer.
- [x] 4.2 Create an `ArticleCard` component displaying cover image, title, description, category, publication date, reading time, and tags.
- [x] 4.3 Visually distinguish featured articles on the listing page.
- [x] 4.4 Implement the empty state for when no published articles exist.
- [x] 4.5 Implement `generateMetadata` for the listing page (title, description).

## 5. Article Detail Page

- [x] 5.1 Create `src/app/articles/[slug]/page.tsx` as a Server Component fetching a single published article by slug.
- [x] 5.2 Call Next.js `notFound()` when no published article matches the slug.
- [x] 5.3 Render article header metadata: title, publication date, category, reading time, cover image, tags.
- [x] 5.4 Add a navigation control back to the articles listing page.
- [x] 5.5 Implement `generateMetadata` deriving title, description, canonical URL, Open Graph tags, and social image from the article.

## 6. Rich Content Rendering

- [x] 6.1 Create a reusable `PortableText` rendering component under `src/components/` wrapping `@portabletext/react`.
- [x] 6.2 Implement custom renderers for headings, paragraphs, marks (bold/italic/links), ordered/unordered lists, block quotes, code blocks, and images, styled consistently with the existing portfolio design.
- [x] 6.3 Ensure an unrecognized block type does not break rendering of the rest of the article.
- [x] 6.4 Wire the renderer into the article detail page.

## 7. Error and Not-Found States

- [x] 7.1 Add a `not-found.tsx` for the `articles/[slug]` route segment.
- [x] 7.2 Add an `error.tsx` for the `articles` route segment so a Sanity fetch failure does not affect the rest of the site.

## 8. Validation

- [x] 8.1 Verify the production build succeeds (`npm run build`).
- [x] 8.2 Verify TypeScript compilation has no errors.
- [x] 8.3 Verify lint passes (`npm run lint`).
- [ ] 8.4 Manually verify `/articles` and `/articles/[slug]` at mobile, tablet, and desktop widths. (Not done: no browser available in this session — dev server is running at localhost:3000 for manual review.)
- [x] 8.5 Manually verify the empty state (no published articles) and the not-found state (invalid/unpublished slug).
- [ ] 8.6 Verify keyboard navigation and screen-reader labeling for the new nav link, article cards, and detail page. (Structurally verified — aria-current, aria-label, alt text, focus-visible styles all present in rendered markup — but not interactively tested with a real browser/screen reader in this session.)
- [x] 8.7 Verify the rest of the portfolio (resume, experience, skills, projects) remains unaffected.
