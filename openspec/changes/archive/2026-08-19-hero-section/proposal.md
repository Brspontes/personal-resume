## Why

With the project foundation in place, the resume website needs its first real content section. The Hero is the primary introduction to the developer — it needs to immediately communicate who they are, their professional role, and their technical background, and give visitors a clear next action (view experience or download the CV), before any other section exists.

## What Changes

- Create a dedicated `Hero` component rendered on the homepage.
- Extract name, professional title, current role context, and a concise professional summary from the reference resume document (`D:/Development/Profile.pdf`), in Portuguese (per project owner's decision), for use in the Hero.
- Display the developer's name and professional title.
- Display a concise professional summary (not a reproduction of the full resume).
- Add a primary CTA ("Ver experiência") that scroll-links to an `#experience` anchor (the Experience section does not exist yet — the anchor target will be implemented in a future change; the link is forward-declared now and becomes functional once Experience exists).
- Add a secondary CTA ("Baixar CV") that downloads a public CV file.
- **Exception to `CLAUDE.md`'s reference-document rule**: the project owner explicitly authorized using `Profile.pdf` itself as the public downloadable CV, copied into `public/cv.pdf`. This is a one-time, explicit exception to the rule "the PDF ... must not be displayed or exposed as part of the website" — it applies only to serving this file as a CV download, not to exposing it as raw reference/source material elsewhere on the site.
- Add a placeholder for the Hero's main visual element (developer photo), sized and positioned as the real photo will be, to be replaced later when a photo is provided.
- Implement responsive layout for mobile, tablet, and desktop.
- Establish reusable visual patterns (spacing, typography scale, container width) that later sections can follow, visually inspired by (not copied from) https://zelio-nextjs.vercel.app/index-2.

## Capabilities

### New Capabilities
- `hero-section`: The homepage Hero — developer introduction (name, title, summary), primary/secondary CTAs, and a visual placeholder, responsive across breakpoints.

### Modified Capabilities
- None. `project-foundation` is unaffected — this change adds content on top of the existing baseline app without changing its requirements.

## Impact

- Affected code: `src/app/page.tsx` (renders the Hero), new `src/components/Hero.tsx` (or similar), new `src/data/profile.ts` (structured profile content used by the Hero), new `public/cv.pdf`.
- Affected systems: none beyond the existing Next.js app — no new external dependencies expected (Tailwind CSS covers styling and simple interactions).
- No breaking changes — this is additive to the minimal homepage from `project-foundation`.
