## Context

See proposal.md - Why. Hero, Professional Highlights, Professional Experience, Skills, and Education (`src/components/Hero.tsx`, `src/components/ProfessionalHighlights.tsx`, `src/components/ProfessionalExperience.tsx`, `src/components/Skills.tsx`, `src/components/Education.tsx`) already establish sourcing content from `src/data/profile.ts` and the shared visual language (`bg-grid-pattern` dot-grid background, `--accent` token, mono/terminal-styled section labels, card-based presentation).

The reference resume (`D:/Development/Profile.pdf`) lists exactly five certifications under "Certifications," as a bare list of titles only:
- Rest com NodeJs: API com Express e MySQL
- Modelagem de Domínios Ricos
- AWS Certified Cloud Practitioner
- Android I: Crie sua App fantástica com Android Studio - 10 horas
- Aplicações Serverless na AWS

No issuer, issue/expiration date, credential ID, or verification link is present for any entry. Per explicit user decision (confirmed before writing this change's artifacts), none of these fields are fabricated or inferred — for example, the issuer is not guessed from the certification's title even where it seems obvious (e.g., "AWS Certified Cloud Practitioner"). This means every real card in this iteration renders name-only; the optional-field behavior (verification link, credential ID) is part of the capability's contract but has no current data to exercise it.

## Goals / Non-Goals

**Goals:**
- Display all five certifications as cards, sourced verbatim from the reference resume, name only.
- Model the data shape to support optional issuer, dates, credential ID, and verification link per entry, so a future resume update that includes this metadata for some or all certifications can populate it without a schema change — while today's actual entries simply omit them.
- Render a verification link as an actual clickable link when a `credentialUrl` is present, satisfying the spec's "Verification Link Access" requirement structurally, even though no current entry has one.
- Keep the component a Server Component with no client-side state — the section is static content, no interactivity beyond a plain anchor link is required.

**Non-Goals:**
- Does not fabricate or infer issuer, dates, or credential IDs for the current five entries — none of the real data exists in the source document.
- Does not display academic degrees (Education's exclusive scope) or free/short courses beyond what the resume already labels as "Certifications."
- Does not change Hero, Professional Highlights, Professional Experience, Skills, or Education.

## Decisions

**Data shape** in `profile.ts` adds a new typed array, matching the conceptual structure from the proposal:
```ts
export interface CertificationEntry {
  id: string;
  name: string;
  issuer?: string;
  issuedAt?: string;
  expiresAt?: string;
  credentialId?: string;
  credentialUrl?: string;
}
```
```ts
certifications: CertificationEntry[]
```
`name` is the only required field beyond `id`, matching what the resume actually provides. `id` is a stable slug (e.g. `"aws-certified-cloud-practitioner"`) used as the React list key, since certification names are the only available identifier and are not guaranteed unique-safe as raw keys long-term.

**Component structure**, following the proposal's suggested composition and the project's existing "one file per section, small subcomponents inline" pattern already used in `Skills.tsx` and `Education.tsx` (no separate files for trivial subcomponents):
- `src/components/Certifications.tsx` — Server Component, default export, the `<section>` wrapper with the `// Certifications` mono label and heading, following `Education.tsx`'s structure.
- An inline `CertificationCard` function component (co-located in the same file, not a separate `CertificationsHeader`/`CertificationsList` file split) renders one card per entry. The proposal's three-component sketch is collapsed to match how `Skills.tsx`/`Education.tsx` already structure a card list — a section wrapper plus one inline card component — since a separate header/list file split would be pure ceremony for a static list with no shared reuse target outside this section.

**Card content renders conditionally per optional field:** `issuer`, `issuedAt`/`expiresAt`, `credentialId`, and `credentialUrl` each render only when present on the entry, satisfying "No Fabricated Certification Metadata" without needing a placeholder or empty-state UI. `credentialUrl`, when present, wraps the card (or a dedicated "Verify credential" affordance) in an `<a href={credentialUrl} target="_blank" rel="noopener noreferrer">`.

**Layout:** a wrapping card grid (`flex flex-wrap gap-4`), matching `Skills.tsx`'s pattern rather than `Education.tsx`'s stacked list — five same-shape cards with no single one needing emphasis (unlike Education's "most recent" highlight) suit a grid better than a stack, and five items give a wrapping grid enough content to avoid looking sparse.

## Risks / Trade-offs

- [All five current entries render name-only, so the optional-field rendering paths (issuer, dates, credential ID, verification link) ship with zero real-data coverage] → Accepted; per explicit user decision the source document does not contain this data and it must not be fabricated. The fields exist in the type/UI so a future resume update can populate them without further design work.
- [`id` slugs are hand-authored in `profile.ts` rather than derived at runtime] → Accepted; mirrors no existing precedent in this codebase (other entities use their natural name as the list key), but a stable explicit `id` is more robust than array index for a list that could be reordered or extended later.
