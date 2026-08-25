## Why

The Hero section introduces who the developer is, but visitors need a fast, scannable way to gauge career depth before reading the full Experience section. A Professional Highlights section right after the Hero surfaces objective, verifiable numbers from the reference resume so visitors immediately grasp the scope of the developer's trajectory.

## What Changes

- Add a new `ProfessionalHighlights` component rendered on the homepage immediately after the Hero.
- Populate it with four highlight metrics, each value/label pair traceable to an exact, unambiguous count or statement in the reference resume document (no estimates, no invented numbers):
  - **7+ Anos de Experiência** — quoted directly from the resume's own summary statement ("7-year experienced Developer" / "Desenvolvedor com 7 anos de experiência").
  - **9 Empresas** — exact count of distinct organizations listed under the resume's Experience section (every employer entry, counted mechanically with no relevance filtering).
  - **5 Certificações** — exact count of items listed under the resume's Certifications section.
  - **2 Idiomas** — exact count of items listed under the resume's Languages section.
- Extend `src/data/profile.ts` with a `highlights` data array (value + label pairs) so the component stays presentation-only and the sourced data stays centralized, consistent with how `Hero.tsx` already consumes `profile.ts`.
- Visually align the section with the Hero's established style (dot-grid/mono accents, terminal-inspired typography), inspired by the stats/highlights layout of the reference site (`https://zelio-nextjs.vercel.app/index-2`) without copying its content or assets.
- Implement a responsive grid layout (mobile stacked, wider grid at tablet/desktop).

## Capabilities

### New Capabilities
- `professional-highlights`: Homepage section presenting objective, resume-sourced professional highlight metrics (value + label pairs) directly below the Hero.

### Modified Capabilities
_None._ No existing capability's requirements change; the Hero's existing scroll target and layout are untouched.

## Impact

- New component: `src/components/ProfessionalHighlights.tsx`.
- Modified data file: `src/data/profile.ts` (adds a `highlights` field to the `Profile` data, or a sibling exported array).
- Modified page: `src/app/page.tsx` (renders the new section after `<Hero />`).
- No new dependencies, no API changes, no changes to existing Hero behavior.
