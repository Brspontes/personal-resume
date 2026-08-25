## Context

See proposal.md - Why. The Hero (`src/components/Hero.tsx`) already sources its content from `src/data/profile.ts` and establishes the visual language (dot-grid background, `--accent` token, mono/terminal-styled typography, `bg-grid-pattern` utility). This change adds a new section reusing that same data-driven pattern.

## Goals / Non-Goals

**Goals:**
- Define exactly which four highlight metrics are shown and the precise, mechanical rule used to compute each value from the reference resume, so the numbers are reproducible and auditable rather than judgment calls made at implementation time.
- Keep the component a pure presentation layer over `profile.ts` data, matching the Hero's existing separation of data and markup.

**Non-Goals:**
- Does not change the Hero section's requirements or layout.
- Does not introduce a generic/reusable "stats" abstraction for hypothetical future metrics beyond the four defined here — extra metrics can be added later by extending the `highlights` array if new verifiable data becomes available.

## Decisions

**Which four highlights, and how each is computed:**

1. **"7+" / "Anos de Experiência"** — quoted directly from the resume's own summary sentence ("7-year experienced Developer...” / "Desenvolvedor com 7 anos de experiência..."). No computation; a direct restatement of a number the source document already asserts about itself.
2. **"9" / "Empresas"** — a mechanical count of every distinct organization heading listed under the resume's "Experiência" section (Caju, Apply, will bank, Vórtx, Função Sistemas - PÁGINA OFICIAL, Itaú, KCMS Intelligent Solutions, FIT - Instituto de Tecnologia, Saraiva). Counted with no relevance filtering (e.g., early non-software roles are still counted) specifically to avoid introducing a subjective curation judgment into a displayed number.
3. **"5" / "Certificações"** — count of items listed under the resume's "Certifications" section.
4. **"2" / "Idiomas"** — count of items listed under the resume's "Languages" section.

Alternative considered: a "technologies used" count aggregated across all roles' "Technologies Used" lists. Rejected because de-duplicating overlapping/renamed entries (e.g., "AWS" vs "AWS Lambda", ".NET Core" vs ".Net") requires subjective judgment calls that risk producing a number not strictly traceable to the document, conflicting with the project's no-fabrication rule.

**Data shape:** add a `highlights: { value: string; label: string }[]` array to `profile.ts` (value typed as `string` to allow the `"7+"` suffix), rather than a separate file, consistent with how Hero content already lives in the same module.

**Layout:** CSS grid, 2 columns on mobile/tablet, 4 columns on desktop (`grid-cols-2 lg:grid-cols-4`), each cell showing a large mono/accent-colored value above a small label — visually paired with the Hero's existing mono/accent styling and inspired by the reference site's stats row without reusing its markup or assets.

## Risks / Trade-offs

- [Counting all 9 "Empresas" includes a non-software early job (Saraiva, Vendedor)] → Mitigated by using a neutral label ("Empresas", not "Empresas de Tecnologia") so the metric stays literally accurate to what it counts.
- [Four fixed highlights may feel sparse if the resume is later updated with more data] → Acceptable per proposal scope; the `highlights` array can be extended later without a structural change.
