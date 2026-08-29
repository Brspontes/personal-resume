## Context

See proposal.md - Why. Relevant current state:

- The app is a single-page Next.js App Router site (`src/app/page.tsx`) with hash-anchored sections (`#home`, `#highlights`, ...) rendered by `Header.tsx` / `DesktopNav.tsx` / `MobileNav.tsx`, driven by a flat `NAV_LINKS` array of `{ label, href }` where every `href` is currently assumed to be a `#`-anchor (see `useActiveSection`, which strips the leading `#`).
- All content today (`src/data/profile.ts`) is static, hardcoded TypeScript data. There is no data-fetching layer, no external API client, and no environment-variable-driven configuration yet.
- Deployment target is Vercel (see README deploy badge), which supports Next.js time-based revalidation (ISR) out of the box with no extra infrastructure.
- The Sanity project/Studio is external to this repository per the proposal ("the Sanity project will remain independent from the portfolio frontend application") and is provisioned and authored outside this codebase. This repo only implements the consuming side.

## Goals / Non-Goals

**Goals:**
- Establish a small, centralized Sanity data-access layer that the rest of the app consumes, so no component talks to Sanity directly.
- Keep the new `/articles` area visually and structurally consistent with the existing portfolio (same design tokens, layout width, typography).
- Make the navigation change additive and minimally invasive to the existing hash-anchor nav mechanism.
- Ship a working, deployable increment even before real article content exists in Sanity (empty state).

**Non-Goals:**
- Building or configuring Sanity Studio itself (schema is specified here as a contract; authoring the actual Studio project is external, per proposal Non-Goals).
- On-demand/webhook-triggered revalidation. Time-based revalidation is sufficient for a personal portfolio's publishing cadence and avoids adding a webhook endpoint, secret management, and retry handling for a "SHOULD"-level requirement.
- Draft/preview mode UI (the architecture must not block it later, but no preview route is built now).

## Decisions

### Use `@sanity/client` + `@sanity/image-url` + `@portabletext/react` as the only new dependencies
Fetching from Sanity, building cover-image URLs, and rendering Portable Text (Sanity's rich-text format) each require a client library; nothing in the existing stack covers any of them. `@sanity/client` is Sanity's official low-level fetch client (GROQ queries, typed generics, CDN support). `@sanity/image-url` is the official, focused image-URL builder for Sanity's image assets. `@portabletext/react` is the official Portable Text renderer and is what makes the "reusable content renderer" requirement tractable without writing a custom block-tree walker.

`next-sanity` (Sanity's Next.js-specific wrapper around these) was evaluated first but rejected after `npm install` pulled in ~870 transitive packages, because it declares Sanity Studio (`sanity`), `@sanity/visual-editing`, and `styled-components` as peer dependencies that npm installs even though this app never mounts a Studio route. The three packages actually used here pull in under 15 packages combined and cover every requirement (centralized retrieval, image rendering, rich content rendering) without the Studio-oriented tooling, which better fits the project's "no new dependency without clear justification" and "avoid libraries that significantly increase footprint" rules. The Next.js-specific conveniences `next-sanity` would have added (a `groq`/`defineQuery` tag and a thin `fetch` wrapper) are trivial to write directly in `src/lib/sanity/client.ts`.

### Centralize all Sanity access in `src/lib/sanity/`
One client module (`client.ts`, reading `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_VERSION` from env) and one query module (`queries.ts`) exporting the five required operations (published articles, featured articles, article by slug, categories, tags) plus a `types.ts` for the `Article` shape. Page and component code imports from this layer only. This satisfies "Centralized Content Retrieval" and keeps Sanity a swappable implementation detail behind a stable interface, which is also what makes future content types (experiences, tutorials) addable without touching page components.

### Published-only visibility via GROQ filter, not app-level filtering
Every query filters on `_type == "article" && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()` at the query level, so unpublished/draft documents are never fetched into the app at all (not fetched-then-hidden). This is the simplest way to guarantee "Published-Only Public Visibility" and leaves room for a future preview mode to use a separate, explicitly-authenticated query path without touching the public one.

### Time-based revalidation via Next.js fetch caching
The Sanity fetch wrapper in `src/lib/sanity/client.ts` uses Next.js's `fetch`-based caching (`next: { revalidate: <seconds> }`), using a single shared revalidation interval (e.g. 60s) for article queries. This satisfies the "SHOULD use Next.js caching/revalidation" requirement with the least moving parts, works natively on Vercel, and requires no webhook secret or API route. Trade-off accepted below.

### Article routes as plain Server Components with `generateStaticParams`/`generateMetadata`
`/articles` and `/articles/[slug]` are Server Components fetching directly from the Sanity layer (no client-side fetching, no React Context) — consistent with the project's "prefer Server Components" and "React Context only when actually required" rules. `generateMetadata` on both routes derives the SEO fields from the fetched article/listing data, satisfying the SEO requirements without a separate metadata system.

### Navigation link model gains a `kind` discriminator
`NAV_LINKS` entries become `{ label, href, kind: "hash" | "route" }`. `DesktopNav`/`MobileNav` render `kind: "route"` links as plain Next.js `<Link>` navigations (no scroll/active-section wiring), while `kind: "hash"` links keep today's `useActiveSection` behavior unchanged. This is the smallest change that lets one link (`Articles`, pointing at `/articles`) coexist with the seven existing anchor links without altering `useActiveSection`'s contract or behavior for the existing links.

### Remote image config
`cdn.sanity.io` is added to `next.config.ts`'s `images.remotePatterns` so cover images can use `next/image` optimization. This is a required, minimal config change, not a broader config rework.

## Risks / Trade-offs

- **[Risk]** Time-based revalidation means a newly published article can take up to the revalidation window to appear. → **Mitigation**: keep the interval short (e.g. 60s), consistent with a personal portfolio's low publish frequency; document the interval in the query layer so it's a one-line change later, and note webhook-based on-demand revalidation as a future enhancement rather than building it now.
- **[Risk]** Introducing an external CMS dependency means the portfolio's articles section is unavailable if Sanity's API is unreachable. → **Mitigation**: scope this to the `/articles` area only; failures there are handled with Next.js `error.tsx`/`not-found.tsx` boundaries local to that route segment so the rest of the portfolio (resume, experience, skills) keeps working.
- **[Risk]** Mixing hash-anchor links and route links in one nav array could be a confusing model for future contributors. → **Mitigation**: the `kind` discriminator makes the two behaviors explicit at the data level rather than inferred from the href string, and existing anchor-link behavior is unchanged.
- **[Trade-off]** Schema/content-model authoring lives outside this repo (in Sanity Studio), so `Article` types in `src/lib/sanity/types.ts` are hand-maintained rather than generated. If the external schema drifts from these types, mismatches surface at runtime, not compile time. Accepted because generating types would require Studio/schema code inside this repo, which the proposal explicitly keeps external.

## Migration Plan

- Additive only: new routes, new components, new `src/lib/sanity/` module, one modified nav data structure, one `next.config.ts` addition. No existing route, component, or data file is removed.
- Environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_VERSION`, and a read token if the dataset is private) must be added to the Vercel project and local `.env.local` before the `/articles` routes can fetch real data; until then, the listing page renders its empty state, so the rest of the site stays deployable.
- No rollback beyond reverting the additive commits/env vars is needed, since no existing behavior is modified except the nav data shape.

## Open Questions

- Exact revalidation interval (proposed default: 60s) — can be tuned later without any spec, approach, or task change.
