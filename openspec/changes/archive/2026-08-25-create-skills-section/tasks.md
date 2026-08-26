## 1. Dependency

- [x] 1.1 Add `react-icons` as a project dependency.

## 2. Data

- [x] 2.1 Replace the `SkillCategory` interface and `skillCategories` field in `src/data/profile.ts` with a flat `skills: string[]` field on `Profile`.
- [x] 2.2 Populate `skills` with the 35 consolidated, deduplicated skills defined in design.md (the `.NET` family collapsed into `.NET`, `ASP`/`ASP.NET` collapsed into `ASP.NET`), in the order listed there.

## 3. Component

- [x] 3.1 In `src/components/Skills.tsx`, define a `skillIcons: Record<string, IconType>` lookup mapping the 22 skills that have an official logo to their `react-icons` import, per the table in design.md (21 from `react-icons/si`, `AWS` from `react-icons/fa`).
- [x] 3.2 Render `profile.skills` as one flat `flex flex-wrap` grid of fixed-size cards — no category headings.
- [x] 3.3 Each card renders the mapped icon when `skillIcons[skill]` exists; otherwise renders the skill's name as centered, wrapping text.
- [x] 3.4 Each card shows a tooltip with the skill's full name on hover, implemented with CSS only (`group` / `group-hover`, `pointer-events-none` on the tooltip) — no client-side state or `"use client"`.
- [x] 3.5 Apply the primary-skill visual treatment (card border/background) when `profile.techStack.includes(skill)`, matching the accent treatment used in the prior badge-based version.
- [x] 3.6 Ensure the grid wraps and stays readable at mobile, tablet, and desktop widths via `flex-wrap` (no breakpoint-specific grid needed).

## 4. Integration

- [x] 4.1 `<Skills />` already renders in `src/app/page.tsx` immediately after `<ProfessionalExperience />` (unchanged from the prior iteration — no action needed here).

## 5. Validation

- [x] 5.1 Verify the app builds successfully and TypeScript compiles with no errors.
- [x] 5.2 Check for linting errors.
- [x] 5.3 Visually verify the section in the browser: every one of the 35 cards renders (logo or text fallback, no blank/broken cards), hovering shows the correct tooltip name, primary skills are visually distinguished, and the grid stays readable at mobile, tablet, and desktop widths.
- [x] 5.4 Confirm the section reads as visually compact relative to the rest of the homepage (the concern that motivated this revision), not as long as the prior category-badge version.
