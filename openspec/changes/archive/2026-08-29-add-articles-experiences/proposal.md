## Why

The portfolio currently only presents a static professional profile (resume, skills, experience, projects). It has no way to publish technical articles, project insights, or career learnings, and no content can change without a code deployment. Introducing an external headless CMS (Sanity) lets content be authored and published independently of the frontend, turning the portfolio into a long-term, growable knowledge base without requiring a redesign for future content types.

## What Changes

- Add a new `/articles` listing page displaying published articles ordered by publication date, with empty and not-found states.
- Add a new `/articles/[slug]` detail page rendering a single published article's rich content, metadata, and navigation back to the listing.
- Add an "Articles" entry to the site's main navigation, linking to the new section.
- Integrate Sanity as an external headless CMS: a typed, centralized query layer (GROQ) for published articles, featured articles, article-by-slug, categories, and tags.
- Define an initial Sanity `article` content schema (title, slug, excerpt, cover image, publication date, category, tags, reading time, featured flag, rich text body, author) designed so future content types (experiences, tutorials, case studies) can be added later without reworking the frontend integration.
- Render Sanity's rich text (Portable Text) through a reusable content-block renderer supporting headings, paragraphs, marks, links, lists, block quotes, code blocks, and images.
- Add per-article and listing-page SEO metadata (title, description, canonical URL, Open Graph, social image) derived from Sanity content.
- Add time-based revalidation/caching for article data so published or edited content appears without a frontend redeploy.
- Ensure only published content is exposed publicly; draft content stays inaccessible to regular visitors. Sanity credentials are read from environment variables and never exposed to the browser beyond the public read-only project ID/dataset needed by the client SDK.

## Capabilities

### New Capabilities
- `articles`: Public-facing articles section — the `/articles` listing page, `/articles/[slug]` detail page, rich content rendering, per-article and listing SEO metadata, empty and not-found states.
- `sanity-cms-integration`: The headless CMS integration layer — Sanity as source of truth for article content, the initial extensible article content model, centralized GROQ queries, published-vs-draft visibility rules, environment-based credential handling, and content caching/revalidation strategy.

### Modified Capabilities
- `navigation-header`: Add an "Articles" link to the main navigation alongside the existing homepage section links, so visitors can reach the new content section from anywhere on the site.

## Impact

- **New routes**: `/articles`, `/articles/[slug]`.
- **New code**: Sanity client/query module, article types, article listing and detail page components, a reusable Portable Text renderer, article card/metadata components.
- **Modified code**: navigation components (`Header.tsx`, `DesktopNav.tsx`, `MobileNav.tsx`) to add the new nav entry.
- **New dependencies**: Sanity client SDK and Portable Text renderer (e.g. `@sanity/client`, `@portabletext/react`) — required to fetch and render CMS content; no alternative avoids an external CMS client.
- **New configuration**: environment variables for Sanity project ID, dataset, and API version/token (server-side only where applicable).
- **Out of scope**: no changes to existing resume/experience/skills/projects sections; no local database; no CMS authentication system (Sanity Studio handles its own auth, external to this app).
- **Deployability**: existing portfolio functionality remains operational throughout; the change can be implemented and shipped incrementally (schema/integration first, then pages).
