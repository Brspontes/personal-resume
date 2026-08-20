## Context

See proposal.md - Why. The current homepage (`src/app/page.tsx`, from the `project-foundation` change) only renders a static "Hello World" message. This design covers how the Hero section is built on top of that baseline, using the reference resume document (`D:/Development/Profile.pdf`) as the source of the developer's identity content, and satisfies `specs/hero-section/spec.md`.

Extracted source facts used to populate the Hero (from `Profile.pdf`, Portuguese version):
- Name: Brian Pontes
- Headline: Software Engineer | Software Developer | Backend Developer | Full stack | NodeJs | .Net | React | Javascript | C# | Kotlin
- Current role: Senior Backend Engineer at Caju (set/2024 - presente)
- Location: Sorocaba, São Paulo, Brasil
- 7 anos de experiência, foco em Backend e Frontend (JavaScript, Node.js, TypeScript, C#/.NET, Kotlin, React)

## Goals / Non-Goals

**Goals:**
- Establish a `Hero` component and a structured content source (`src/data/profile.ts`) that later sections (About, Experience, Skills, etc.) can also read from, avoiding duplicated hardcoded profile facts.
- Keep the visual composition inspired by the Zelio reference without importing its code, assets, or copy.

**Non-Goals:**
- Building the Experience section or any other section the Hero links to — only the Hero itself and a forward-declared anchor target name (`#experience`).
- Internationalization / language switching — Portuguese only, per the project owner's decision.
- Real developer photo — a placeholder visual is implemented; swapping in the real photo is a follow-up content change, not a code change beyond swapping an asset.

## Decisions

- **Content source of truth**: Add `src/data/profile.ts` exporting a typed `profile` object (name, title, summary, ctas, location) derived from `Profile.pdf`. Rationale: keeps the Hero component presentational and gives future sections (Experience, About) one place to read shared identity facts from, consistent with CLAUDE.md's "Separate presentation from business logic" and "Reuse components/data when there is genuine need."
- **Component shape**: `src/components/Hero.tsx`, a Server Component (no client interactivity needed — the CTAs are plain anchor links, not stateful widgets), rendered from `src/app/page.tsx` replacing the current "Hello World" content.
- **Primary CTA target**: Plain anchor `href="#experience"`. Since the Experience section doesn't exist yet, this resolves to "no matching element" (browser no-ops) until a future change adds `id="experience"` to that section — no JS scroll library needed, consistent with avoiding unnecessary dependencies.
- **Secondary CTA (CV download)**: Static `<a href="/cv.pdf" download>` pointing at `public/cv.pdf`. `Profile.pdf` is copied to `public/cv.pdf` as part of this change's tasks, per the project owner's explicit exception (see proposal.md).
- **Visual placeholder**: A CSS-only placeholder (Tailwind-styled `div`, e.g. a bordered/gradient block with the developer's initials), not an `<Image>` pointing at a missing file. Rationale: avoids a broken-image state and satisfies the "no broken image or empty gap" scenario in the spec without needing a temporary stock asset. Swapping in a real photo later is a one-file change (replace the block with `next/image`).
- **Professional summary copy**: A concise, original condensation of the Portuguese summary in `Profile.pdf` (not a verbatim copy), written during task execution and stored in `profile.ts`. It must reflect only facts present in the document (7 years of experience, backend/frontend focus, current stack) and prioritize the most recent role (Caju, Senior Backend Engineer) per the proposal's "prioritize most recent and relevant" rule.
- **Styling approach**: Tailwind utility classes directly in `Hero.tsx`, following the spacing/typography patterns already established by `globals.css`/Tailwind theme from `project-foundation` — no new design tokens or CSS files introduced.

## Risks / Trade-offs

- [Primary CTA points at an anchor that doesn't exist yet, so it visibly does nothing until Experience ships] → Acceptable and intentional per the proposal; note it in the PR/commit so it's not mistaken for a bug.
- [Placeholder visual may need rework once a real photo arrives if its aspect ratio differs] → Keep the placeholder's container using a fixed aspect-ratio utility so swapping the fill content later doesn't require layout changes.
- [Condensed professional summary is an editorial judgment call, not a literal quote] → Constrained by the spec's requirement that it be "based strictly on" the source and not fabricate facts; content will be reviewed against `Profile.pdf` before considering the task done.

## Open Questions

None — the project owner already resolved the two decisions that would have changed scope (CV file source, placeholder vs. real photo) and the content language, so nothing here is deferred to guesswork.
