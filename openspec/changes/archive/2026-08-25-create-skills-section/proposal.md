## Why

Hero, Professional Highlights, and Professional Experience are implemented. Experience shows technologies embedded inside each company's story, but a visitor scanning for "does this person know X" has no single place to check — they would have to open every company card and cross-reference. The Skills section fills that gap: a dedicated view of every technology, tool, and technical competency the reference resume documents, without repeating the narrative (roles, responsibilities, dates) that Experience already owns.

An earlier iteration of this change grouped skills into 10 text-badge categories. After implementation, review found it too long/heavy relative to the rest of the homepage. This revision replaces it with a compact grid of logo cards (a tooltip on hover reveals the full name), with no category grouping.

## What Changes

- Add a new `Skills` section rendered on the homepage after Professional Experience.
- Display every skill in one flat grid — no category headings/grouping.
- Render each skill as a card showing its official technology logo; when a skill has no available official logo, the card shows the skill's name as text instead (see design.md for the full logo/text-fallback mapping — several real gaps exist, e.g. AWS Lambda, Azure, Oracle, and SQL Server have no available brand icon).
- Show a tooltip with the skill's full name when a visitor hovers over its card.
- Visually distinguish the developer's primary/core skills (reusing the existing `profile.techStack` array) from the rest.
- De-duplicate a skill that appears in more than one professional experience so it shows once in the grid.
- Consolidate near-duplicate resume entries that would otherwise render identical or missing logos side by side (`.NET` / `.NET Core` / `.NET Full Framework` → one `.NET` card; `ASP` / `ASP.NET` → one `ASP.NET` card).
- Extend `src/data/profile.ts` with a flat, typed `skills: string[]` array sourced from the reference resume and cross-checked against the technologies already recorded in `profile.experiences`, following the same no-fabrication rule as prior sections.
- Implement a responsive, wrapping card grid consistent with the visual language already established (dot-grid background, accent color, mono/terminal-styled typography).

## Capabilities

### New Capabilities
- `skills-section`: Flat grid display of the developer's technical skills as logo (or text-fallback) cards with hover tooltips, sourced from the reference resume, with primary skills visually highlighted.

### Modified Capabilities
_None._ Hero, Professional Highlights, and Professional Experience requirements are unchanged; this section is additive.

## Impact

- New component: `src/components/Skills.tsx` (Server Component — no interactivity is required; the hover tooltip is CSS-only).
- New dependency: `react-icons` (provides the technology logo set; tree-shakeable, only imported icons are bundled).
- Modified data file: `src/data/profile.ts` (adds a flat `skills: string[]` field; no `SkillCategory` type).
- Modified page: `src/app/page.tsx` (renders the new section after `<ProfessionalExperience />`).
- No changes to existing Hero, Professional Highlights, or Professional Experience behavior.
