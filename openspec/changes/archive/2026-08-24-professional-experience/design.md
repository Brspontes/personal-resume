## Context

See proposal.md - Why. Hero and Professional Highlights (`src/components/Hero.tsx`, `src/components/ProfessionalHighlights.tsx`) already establish the pattern of sourcing content from `src/data/profile.ts` and sharing the dot-grid/`--accent`/mono visual language via the `bg-grid-pattern` utility. This change follows the same pattern but, unlike the prior two (Server Components only), needs client-side interactivity for company selection.

## Goals / Non-Goals

**Goals:**
- Define exactly which resume entries become experience cards, and exactly which fields are shown for each, so the mapping is auditable against the source document rather than a judgment call made ad hoc during implementation.
- Keep the interactive (client) surface as small as possible; only the selection behavior needs to run on the client.

**Non-Goals:**
- Does not build a generic "content management" system for experience entries — the data is a static array in `profile.ts`, matching the project's existing pattern.
- Does not attempt to reconcile overlapping employment periods (e.g., Apply and will bank overlap in the source resume) into a single merged timeline visualization; entries are shown as independent cards in the resume's own listed order.

## Decisions

**Which resume entries become cards, and why:**

The reference resume lists 9 organizations under "Experiência". This section includes 8 of them and excludes 1:

1. Caju — Senior Backend Engineer — Setembro de 2024 — Atual (current)
2. Apply — Tech Consultant | Tech Lead — Junho de 2023 — Novembro de 2024
3. will bank — Senior Full Stack Engineer — Maio de 2022 — Agosto de 2024
4. Vórtx — Mid Full Stack Engineer — Dezembro de 2020 — Maio de 2022
5. Função Sistemas - PÁGINA OFICIAL — Mid System Analyst — Setembro de 2020 — Novembro de 2020
6. Itaú — Jr Software Engineer — Julho de 2017 — Setembro de 2020
7. KCMS Intelligent Solutions — Jr Developer — Março de 2017 — Julho de 2017
8. FIT - Instituto de Tecnologia — Jr Tester — Abril de 2015 — Março de 2017

**Excluded: Saraiva (Vendedor, Abril de 2014 — Maio de 2014).** This is a retail sales role with no listed responsibilities or technologies in the resume. Including it would leave the "responsibilities" and "technologies" fields empty for a section whose purpose is to showcase technical trajectory, so it is left out entirely rather than shown as a near-empty card.

**FIT is shown once, using only the "Jr Tester" role's own stated period (Abril de 2015 — Março de 2017).** The resume groups two roles under this company (Jr Tester and an earlier "Aprendiz", Maio de 2014 — Abril de 2015) under one aggregate company duration. The "Aprendiz" role has no listed responsibilities or technologies, so rather than inventing a merged date range spanning both roles (which the resume itself never states as a single period), the card uses exactly the period and activities stated for the one role that has content: Jr Tester.

**Ordering:** cards are ordered exactly as the resume lists them (Caju first, FIT last), which is already most-recent-first. No re-derivation of order from raw dates — this avoids disagreements between the resume's own ordering and a recomputed one (the resume includes overlapping roles, e.g. Apply and will bank, where a purely date-driven sort could disagree with the source's own sequence).

**Fields per entry**, taken verbatim/near-verbatim from the resume:
- `company`, `role`, `period` (display string in Portuguese, e.g. "Setembro de 2024 — Atual"), `location` (when the resume states one; several entries have none), `current` (true only for Caju), `description` (only Caju, Apply, will bank, and Vórtx have a resume-provided descriptive paragraph — Função Sistemas, Itaú, KCMS, and FIT do not, so their `description` is omitted rather than fabricated), `responsibilities` (the resume's own bullet lists / "Key Activities" / "Core Competencies"), `technologies` (the resume's own "Technologies Used" lists; Função Sistemas, Itaú, KCMS, and FIT have no such list, so their bullets already double as the closest available technical detail and `technologies` is omitted for them).

**Data shape** in `profile.ts`:
```ts
export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location?: string;
  current?: boolean;
  description?: string;
  responsibilities: string[];
  technologies?: string[];
}
```

**Interactivity:** a client component (`ExperienceNavigator` or similar) owns the `selectedIndex` state and renders both the company nav and the detail panel from the same `experiences` array passed down as a prop from the server-rendered `ProfessionalExperience` section — avoids duplicating the data-fetching pattern and keeps the parent section itself a Server Component.

**Layout:** two-column grid on desktop/tablet (nav list + detail panel side by side, similar structurally to the ASCII layout in the proposal), single column (nav above detail) on mobile — implemented with Tailwind grid utilities, consistent with the responsive patterns already used in Hero and Professional Highlights.

## Risks / Trade-offs

- [Excluding Saraiva and folding FIT's two roles into one could be seen as omitting resume content] → Mitigated by documenting the exact rule here (no responsibilities/technologies listed) so the decision is auditable and reversible if the reference resume is updated with more detail for those entries.
- [Client Component for the whole interactive area increases client JS versus a pure Server Component] → Acceptable and necessary; the selection behavior is inherently client-side, and the surface is kept to the single navigator component per the Goals above.
