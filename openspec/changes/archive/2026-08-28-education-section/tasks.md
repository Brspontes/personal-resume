## 1. Data

- [x] 1.1 Add the `EducationEntry` interface (`degree`, `institution`, `period`) to `src/data/profile.ts`.
- [x] 1.2 Add the `education: EducationEntry[]` field to the `Profile` interface.
- [x] 1.3 Populate `profile.education` with the two academic entries from the reference resume, most recent first: MBA Arquitetura de Software e Soluções (Instituto de Gestão e Tecnologia da Informação, julho de 2021 — outubro de 2022) and Bacharel em Ciência da Computação (Universidade Paulista, 2013 — 2016).

## 2. Component

- [x] 2.1 Create `src/components/Education.tsx` as a Server Component, structurally modeled on `Skills.tsx` (`// Education` mono label, heading, `bg-grid-pattern` section wrapper).
- [x] 2.2 Render one card per `profile.education` entry showing degree, institution, and period.
- [x] 2.3 Apply the accent emphasis treatment to the first (most recent) card only.
- [x] 2.4 Implement a responsive stacked card layout (mobile through desktop) consistent with the section's own requirement and the rest of the homepage.

## 3. Integration

- [x] 3.1 Render `<Education />` in `src/app/page.tsx` after `<Skills />`.

## 4. Validation

- [x] 4.1 Run the build and TypeScript compilation and confirm no errors.
- [x] 4.2 Run the linter and confirm no errors.
- [x] 4.3 Visually verify the section on mobile, tablet, and desktop viewport widths.
- [x] 4.4 Confirm the MBA card is visually distinguished as the most recent entry and no certifications or short courses appear in the section.
