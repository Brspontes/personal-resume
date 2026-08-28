## Context

See proposal.md - Why. Hero, Professional Highlights, Professional Experience, and Skills (`src/components/Hero.tsx`, `src/components/ProfessionalHighlights.tsx`, `src/components/ProfessionalExperience.tsx`, `src/components/Skills.tsx`) already establish sourcing content from `src/data/profile.ts` and the shared visual language (`bg-grid-pattern` dot-grid background, `--accent` token, mono/terminal-styled section labels).

The reference resume (`D:/Development/Profile.pdf`) lists exactly two academic entries under "Formação acadêmica":
- MBA Arquitetura de Software e Soluções — Instituto de Gestão e Tecnologia da Informação (julho de 2021 – outubro de 2022)
- Bacharel em Ciência da Computação — Universidade Paulista (2013 – 2016)

No other degrees, and no ongoing/ambiguous-status entries, are present, so there is no "in progress" state to design for.

## Goals / Non-Goals

**Goals:**
- Display both academic entries as cards, most recent first (MBA, then Bachelor's), matching the reverse-chronological convention already used by Professional Experience.
- Visually highlight the most recent entry (MBA) using the same accent treatment already established for "current/primary" emphasis in Professional Experience (`current`) and Skills (`isPrimary`), for visual consistency.
- Keep the component a Server Component with no client-side state — the section is static content, no interactivity is required.

**Non-Goals:**
- Does not display certifications or short/free courses (AWS Certified Cloud Practitioner, Alura courses, etc.) — reserved for a future, separate section per the proposal.
- Does not build a generic "in progress / completed" status system — the two real entries are both completed, so no such state exists to model.
- Does not change Hero, Professional Highlights, Professional Experience, or Skills.

## Decisions

**Data shape** in `profile.ts` adds a new typed array, following the existing `ExperienceEntry` pattern:
```ts
export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
}
```
```ts
education: EducationEntry[]
```
No `current`/`status` field is added — unlike `ExperienceEntry`, both real entries are completed, and a status flag with no data behind it would be dead code. "Most recent" is derived positionally: the first entry in the array (array order is authored chronologically, most recent first, mirroring how `experiences` is already authored).

**Component:** `src/components/Education.tsx`, a Server Component (no `"use client"`), structurally modeled on `Skills.tsx` — a `<section>` with the `// Education` mono label, a heading, and a card list rendered via `.map()`. The most recent card (`profile.education[0]`) receives the same `border-accent/40 bg-accent/10` emphasis treatment already used for `isPrimary` skill cards and the `current` experience company button, applied by index comparison (`index === 0`) rather than a data field, since no second "current" entry will ever exist for this developer's completed degrees.

**Layout:** stacked cards (`flex flex-col gap-4` or equivalent), not a grid — with only two entries, a multi-column grid would look sparse on desktop per the section's own responsive requirement. Each card shows degree, institution, and period as stacked text lines, no icons (unlike Skills, degrees have no brand logos to source).

## Risks / Trade-offs

- [Only two entries exist today, so the "most recent = first array item" convention is unverified against edge cases like tied periods] → Accepted; this mirrors the same convention already in production use for `experiences`, and the resume has no such tie.
- [No "in progress" status modeled] → Accepted; both current resume entries are completed, and modeling a hypothetical future state would be a premature abstraction per project guidelines. If a future resume update adds an in-progress degree, `EducationEntry` can be extended then.
