## Context

See proposal.md - Why. Hero, Professional Highlights, and Professional Experience (`src/components/Hero.tsx`, `src/components/ProfessionalHighlights.tsx`, `src/components/ProfessionalExperience.tsx`) already establish sourcing content from `src/data/profile.ts` and the shared visual language (dot-grid background via `bg-grid-pattern`, `--accent` token, mono/terminal-styled typography).

This design supersedes an earlier iteration of the same change that grouped skills into 10 text-badge categories (Languages, Backend, Frontend, etc.). That version was implemented, built, and passed lint/type-check, but user review found it visually too long/heavy for a single section. This revision replaces category badges with a flat grid of logo cards with a hover tooltip, per direct user feedback.

**Icon availability research (done before finalizing this design):** `react-icons` (added as a new dependency) bundles several brand-icon sets (`si` = Simple Icons, `fa` = Font Awesome, `di` = Devicons, `tb` = Tabler, etc.). Checking every skill from the original inventory against these sets found real, hard gaps — not implementation oversights: **Oracle, SQL Server, AWS Lambda, Azure, Micronaut, Kotest, Razor, ASP, ASP.NET, and C# have no official brand logo in any bundled set**, and **Microservices, Hexagonal Architecture, and CI/CD are architecture/process concepts with no brand logo to begin with**. This matches a known industry pattern: Simple Icons has removed several cloud-vendor marks (AWS, Azure, Oracle) after trademark takedown requests. Using an unrelated or generic icon for these would misrepresent the skill (e.g., Simple Icons' "Serverless" icon is specifically the *Serverless Framework* product mark, not a generic serverless-computing glyph — using it for the resume's generic "Serverless" entry would falsely imply use of that specific tool, so it is treated as logo-less too).

## Goals / Non-Goals

**Goals:**
- Every skill from the reference resume (already audited in the prior iteration of this design, see git history of this file) remains visible — a missing brand logo is not a reason to drop a real, resume-documented skill.
- Use each skill's real, official logo when one exists; never substitute an unrelated or generic icon that would misrepresent the skill.
- Reuse `profile.techStack` (already used by Hero) as the definition of "primary skills," unchanged from the prior iteration.
- Keep the component a Server Component with no client-side state — the hover tooltip is implemented with CSS only (`group-hover`), not JavaScript.

**Non-Goals:**
- Does not display certifications or language proficiency — unchanged from the prior iteration; still out of scope.
- Does not attempt to infer skill proficiency levels — unchanged.
- Does not change Hero, Professional Highlights, or Professional Experience.

## Decisions

**New dependency: `react-icons`.** Chosen over hand-sourcing/hosting individual SVG logo files in `public/logos` (the pattern used for company logos in Professional Experience) because it bundles Simple Icons plus several other maintained brand-icon sets in one package, covers the large majority of this section's inventory out of the box, and is tree-shakeable (only the icons actually imported are bundled). This is the same choice already confirmed with the project owner for this change.

**Icon source per skill is pinned explicitly** (not left to implementation-time judgment), primarily from `react-icons/si` (Simple Icons), with `react-icons/fa` (Font Awesome) used only where Simple Icons has no entry:

| Skill | Icon import |
|---|---|
| JavaScript | `SiJavascript` (`si`) |
| TypeScript | `SiTypescript` (`si`) |
| Kotlin | `SiKotlin` (`si`) |
| Node.js | `SiNodedotjs` (`si`) |
| NestJS | `SiNestjs` (`si`) |
| Spring Boot | `SiSpringboot` (`si`) |
| .NET | `SiDotnet` (`si`) |
| React | `SiReact` (`si`) |
| HTML5 | `SiHtml5` (`si`) |
| CSS3 | `SiCss` (`si`) |
| Bootstrap | `SiBootstrap` (`si`) |
| jQuery | `SiJquery` (`si`) |
| PostgreSQL | `SiPostgresql` (`si`) |
| MySQL | `SiMysql` (`si`) |
| MongoDB | `SiMongodb` (`si`) |
| AWS | `FaAws` (`fa`) — no Simple Icons entry exists |
| Docker | `SiDocker` (`si`) |
| Kafka | `SiApachekafka` (`si`) |
| Jest | `SiJest` (`si`) |
| Datadog | `SiDatadog` (`si`) |
| Splunk | `SiSplunk` (`si`) |
| Claude | `SiClaude` (`si`) |

**Skills with no available official logo render as a text card instead** (per direct user decision), showing the skill's own name at a small size, centered, wrapping as needed — never a guessed abbreviation, a generic placeholder glyph, or a borrowed unrelated logo:

C#, Micronaut, ASP.NET, Razor, SQL Server, Oracle, AWS Lambda, Azure, Serverless, Kotest, CI/CD, Microservices, Hexagonal Architecture.

**Consolidation of near-duplicate .NET/ASP entries** (per direct user decision): the prior iteration kept `.NET`, `.NET Core`, `.NET Full Framework` as three separate text badges (justified there by an "exact-string-dedup only" rule for a text medium). In a logo-card medium, all three would render the same single generic `.NET` mark (or, for Full Framework, no mark at all) side by side, which reads as a bug rather than a deliberate distinction. They are consolidated into one `.NET` skill (logo: `SiDotnet`). Likewise `ASP` and `ASP.NET` consolidate into one `ASP.NET` skill (text card, no logo available for either name).

**Flat skill inventory** (35 skills total, after consolidation; order below is the array order in `profile.ts`, grouped visually only in this table for readability — the rendered grid has no headings or section breaks):

- **Languages:** JavaScript, TypeScript, C#, Kotlin
- **Backend:** Node.js, NestJS, Spring Boot, Micronaut, .NET, ASP.NET, Razor
- **Frontend:** React, HTML5, CSS3, Bootstrap, jQuery
- **Databases:** PostgreSQL, MySQL, MongoDB, SQL Server, Oracle
- **Cloud & Infrastructure:** AWS, AWS Lambda, Azure, Docker, Serverless
- **Messaging:** Kafka
- **Testing:** Jest, Kotest
- **DevOps & Monitoring:** CI/CD, Datadog, Splunk
- **Architecture:** Microservices, Hexagonal Architecture
- **Tools:** Claude

**Data shape** in `profile.ts` changes from category-grouped to flat:
```ts
skills: string[]
```
replacing the previous `skillCategories: SkillCategory[]` field and the `SkillCategory` interface (removed — no longer needed since the grid is flat).

**Icon lookup lives in the component layer, not `profile.ts`.** `profile.ts` stays plain content (skill name strings only) per the project's existing "data has no framework/UI imports" pattern (mirrors `experiences`, `highlights`). A `skillIcons` lookup (`Record<string, IconType>`) mapping skill name → icon component is defined in `src/components/Skills.tsx` itself (the only consumer) using the table above; a skill absent from the map renders the text-card fallback.

**Component:** `src/components/Skills.tsx` stays a Server Component (no `"use client"`) — the tooltip needs no JavaScript. Each card is a `<div className="group relative ...">`: the icon (or fallback text) is the visible content, and a tooltip `<span>` is absolutely positioned above the card, `opacity-0` by default and `opacity-100` on `group-hover`, with `pointer-events-none` so it never intercepts the hover itself. `profile.techStack.includes(skill)` still determines the primary/accent treatment, applied to the card's border/background exactly as it was applied to badges in the prior iteration.

**Layout:** a single `flex flex-wrap gap-4` grid of fixed-footprint cards (e.g. `h-20 w-20`), replacing the per-category `space-y-8` stack of badge rows. Inherently responsive without breakpoint-specific grid logic, same reasoning as the prior iteration.

## Risks / Trade-offs

- [13 of 35 cards show text instead of a logo, so the grid is visually mixed rather than uniformly iconographic] → Accepted; the alternative (dropping these skills) would remove real, resume-documented skills, which the user explicitly ruled out.
- [`react-icons` is a new runtime dependency] → Accepted; already confirmed with the project owner, tree-shaking keeps the bundle impact to only the ~22 icons actually imported.
- [Consolidating `.NET` variants and `ASP`/`ASP.NET` loses the textual distinction the prior iteration preserved] → Accepted; the user explicitly chose consolidation over showing the same generic logo (or no logo) on multiple adjacent cards.
- [CSS-only tooltip via `group-hover` has no touch-device equivalent (no hover on mobile)] → Accepted for this iteration; on touch devices the card's visible content (logo or text) still identifies the skill on its own — the tooltip is a desktop enhancement, not the only way to identify a skill.
