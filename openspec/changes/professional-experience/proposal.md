## Why

The Hero and Professional Highlights sections give visitors a quick summary, but a portfolio needs the actual career story: which companies, which roles, and what was done there. The Professional Experience section fills that gap with an interactive, card-based way to browse the developer's trajectory, sourced strictly from the reference resume document, instead of a traditional static timeline.

## What Changes

- Add a new `ProfessionalExperience` section rendered on the homepage after Professional Highlights.
- Add a company navigation list (cards/visual elements, one per company) ordered most-recent-first, matching the order already used in the reference resume document.
- Selecting a company shows its details in a detail panel: role, period, description (when the resume provides one), responsibilities, and technologies (when listed).
- Visually mark the currently selected company and, separately, the current/ongoing role (Caju, "Setembro de 2024 — Atual").
- Default selection on load is the most recent (current) experience.
- Extend `src/data/profile.ts` with an `experiences` array sourced from the reference resume, following the same no-fabrication rule as prior sections.
- Exclude entries that carry no software/technical content (see design.md for which resume entries are included/excluded and why).
- Implement responsive behavior (card list and detail panel stack on narrow viewports).
- Keep the visual language established by Hero and Professional Highlights (dot-grid background, accent color, mono/terminal-styled typography).

## Capabilities

### New Capabilities
- `professional-experience`: Interactive, resume-sourced section presenting the developer's career history as a company-driven navigation with a detail panel.

### Modified Capabilities
_None._ Hero and Professional Highlights requirements are unchanged; this section is additive.

## Impact

- New component(s): `src/components/ProfessionalExperience.tsx` (and a client-side sub-component for the interactive selection, since selecting a company to update the detail panel requires client-side state).
- Modified data file: `src/data/profile.ts` (adds an `experiences` field).
- Modified page: `src/app/page.tsx` (renders the new section after `<ProfessionalHighlights />`).
- No new dependencies, no API changes, no changes to existing Hero or Professional Highlights behavior.
