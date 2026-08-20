## Context

See proposal.md - Why. The repository currently has an empty `src/` directory and no application tooling. This design covers the initial scaffolding decisions needed to satisfy the requirements in `specs/project-foundation/spec.md`.

## Goals / Non-Goals

**Goals:**
- Pick a concrete, conventional Next.js setup that satisfies the stack mandated by CLAUDE.md (Next.js, React, TypeScript, Tailwind CSS).
- Keep the scaffold minimal and idiomatic so future feature work has no scaffolding decisions left to make.

**Non-Goals:**
- Any resume content, sections, or components beyond a placeholder homepage.
- CI/CD, deployment, linting rule customization, or testing framework setup — out of scope for this change.

## Decisions

- **Router**: Use the Next.js App Router (`src/app/`), not the Pages Router. Rationale: App Router is the current Next.js default and is what the proposal's directory structure (`src/app/`) already assumes; it also aligns with the "prefer Server Components" guidance in CLAUDE.md.
- **Project structure**: Use `src/` as the source root with `app/`, `components/`, and `data/` subdirectories, matching the structure specified in the proposal. `components/` holds shared/reusable UI components (empty placeholder for now); `data/` is reserved for future resume content data (e.g., structured content sourced from the profile document), not populated in this change.
- **Node version pinning**: Declare `"engines": { "node": "24.19.0" }` in `package.json` and add a `.nvmrc` file containing `24.19.0`. Rationale: `engines` documents the requirement for anyone inspecting `package.json`/npm tooling, and `.nvmrc` supports common local version managers (nvm, fnm) — both are standard, low-overhead conventions, no new dependency required.
- **Package manager**: Use npm (already available with Node.js, no extra tooling to install). No lockfile-specific tooling (pnpm/yarn) is introduced, consistent with CLAUDE.md's guidance to avoid unnecessary dependencies.
- **Tailwind CSS setup**: Use Tailwind's standard Next.js integration (PostCSS config + `globals.css` with Tailwind directives, imported from the root layout). No additional Tailwind plugins are added — none are needed for a placeholder homepage.
- **Homepage**: Implement as a Server Component at `src/app/page.tsx` (no `"use client"` needed for a static "Hello World" message), consistent with the performance guidance to prefer Server Components when interactivity isn't required.
- **TypeScript strictness**: Use the strict mode that `create-next-app`'s TypeScript template enables by default (`"strict": true` in `tsconfig.json`), consistent with CLAUDE.md's guidance to avoid `any` and use TypeScript consistently.

## Risks / Trade-offs

- [Scaffolding via `create-next-app` may pull in defaults not explicitly reviewed (e.g., ESLint config, specific dependency versions)] → Review generated `package.json` and config files after scaffolding and remove/adjust anything not aligned with CLAUDE.md before considering the task done.
- [Node 24.19.0 pinning is advisory only (`engines` does not block installs by default, `.nvmrc` requires a version manager)] → Acceptable for this stage; enforcing it strictly (e.g., `engine-strict`) is not required by the proposal and can be revisited later if needed.

## Open Questions

None — the proposal's directory structure and stack requirements leave no undecided items that would change the spec, approach, or task breakdown.
