## 1. Data

- [x] 1.1 Add an `ExperienceEntry` interface and an `experiences: ExperienceEntry[]` field to `Profile` in `src/data/profile.ts`.
- [x] 1.2 Populate `experiences` with the 8 entries defined in design.md (Caju, Apply, will bank, Vórtx, Função Sistemas, Itaú, KCMS, FIT), in that exact order, with each entry's role/period/location/description/responsibilities/technologies taken from the reference resume as documented in design.md.

## 2. Components

- [x] 2.1 Create `src/components/ProfessionalExperience.tsx` as a Server Component that renders the section wrapper (heading, background) and passes `profile.experiences` to the interactive navigator.
- [x] 2.2 Create a client "use client" navigator component that owns `selectedIndex` state, renders the company navigation list, and renders the detail panel for the selected entry.
- [x] 2.3 Mark the currently selected company distinctly in the navigation.
- [x] 2.4 Mark the current/ongoing role (Caju) distinctly, independent of selection state.
- [x] 2.5 Default the initial selection to the most recent entry (index 0).
- [x] 2.6 Render description (when present), responsibilities, and technologies (when present) in the detail panel, omitting fields that are absent for a given entry rather than showing placeholders.
- [x] 2.7 Implement the responsive layout: side-by-side nav/detail on tablet+/desktop, stacked on mobile.
- [x] 2.8 Apply the existing visual language (dot-grid background via `bg-grid-pattern`, `--accent` token, mono typography) consistent with Hero and Professional Highlights.

## 3. Integration

- [x] 3.1 Render `<ProfessionalExperience />` in `src/app/page.tsx` immediately after `<ProfessionalHighlights />`.

## 4. Validation

- [x] 4.1 Verify the app builds successfully and TypeScript compiles with no errors.
- [x] 4.2 Check for linting errors.
- [x] 4.3 Visually verify the section in the browser at mobile, tablet, and desktop widths, including selecting different companies.
- [x] 4.4 Confirm each displayed experience entry's fields match design.md against the reference resume, and that Saraiva is absent.
