## Context

See proposal.md - Why. Hero, Professional Highlights, Professional Experience, Skills, Education, and Certifications (`src/components/Hero.tsx`, `src/components/ProfessionalHighlights.tsx`, `src/components/ProfessionalExperience.tsx`, `src/components/Skills.tsx`, `src/components/Education.tsx`, `src/components/Certifications.tsx`) already establish sourcing content from `src/data/profile.ts` and the shared visual language (`bg-grid-pattern` dot-grid background, `--accent` token, mono/terminal-styled section labels, card/link hover states already used e.g. in `Skills.tsx`'s `hover:border-accent/50`).

The reference resume (`D:/Development/Profile.pdf`) and the project's own configuration provide exactly three real contact channels for the developer:
- Email: `brian.robert16@hotmail.com`
- LinkedIn: `https://www.linkedin.com/in/brianpontes-420675a4`
- Personal website: `https://www.brianpontes.com.br/`

No GitHub profile is listed anywhere in the resume or the project. Per the no-fabrication rule already applied in every prior section (Education, Certifications), it is not added or guessed.

`src/app/page.tsx` currently ends with `<Certifications />` as the last rendered element inside `<main>`; there is no footer element anywhere in the current layout (`src/app/layout.tsx` only wraps `{children}`).

## Goals / Non-Goals

**Goals:**
- Contact and Footer both read their channel data from one shared source in `profile.ts`, so the same three real links are never hand-duplicated in two components that could drift apart.
- Contact is the primary call-to-action (larger, more prominent); Footer repeats the same links in a visually subdued, minimal form, satisfying "Minimal Footer Presentation" without maintaining two separate lists of links.
- The copyright year is computed at render time (`new Date().getFullYear()`), never hand-typed, so "Current-Year Copyright" holds automatically without a yearly manual edit.
- Keep both components Server Components with no client-side state — hover/focus states are pure CSS (`hover:`/`focus-visible:` Tailwind variants), matching how every prior section already implements hover.

**Non-Goals:**
- Does not build a contact form, backend, or API — explicitly out of scope per the proposal.
- Does not add a GitHub link — not available in the source data.
- Does not change Hero, Professional Highlights, Professional Experience, Skills, Education, or Certifications.
- Does not add social links beyond the three real channels (no fabricated Twitter/X, Instagram, etc.).

## Decisions

**Data shape** in `profile.ts` adds a small typed `contact` object (not an array, since these are fixed, singular channels, unlike the list-shaped `experiences`/`education`/`certifications`):
```ts
export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface Contact {
  email: string;
  channels: ContactChannel[];
}
```
```ts
contact: Contact
```
`email` is kept as a plain string (used to build the `mailto:` href and, optionally, displayed as text) separately from `channels` (LinkedIn, website) which are rendered as generic labeled links. This avoids a one-off special case inside the component for "the one channel that isn't a plain href" — the component builds the `mailto:` href itself from `contact.email`, while `channels` entries are already complete hrefs ready to render.

**Component structure**, following the established one-file-per-section pattern:
- `src/components/Contact.tsx` — Server Component, default export. Section wrapper (`// Contact` mono label, heading, `bg-grid-pattern`, matching Certifications/Education). Renders the email as a `mailto:` link and each `contact.channels` entry as an `<a target="_blank" rel="noopener noreferrer">`, each styled as a distinct clickable row/pill with `hover:` and `focus-visible:` Tailwind states (no JS interactivity needed — mirrors the CSS-only hover pattern already used in `Skills.tsx`'s cards).
- `src/components/Footer.tsx` — Server Component, default export. A plain `<footer>` element (not a `<section>`, since it is structurally the page's closing landmark, not a scrolling content section) showing `profile.name`, `profile.role`, the same `contact` links rendered smaller/subdued (e.g. `text-sm text-zinc-500`, no card/border chrome), and a `© {new Date().getFullYear()} {profile.name}` line.

**Page integration:** `src/app/page.tsx` renders `<Contact />` as the last child inside `<main>` (after `<Certifications />`), and `<Footer />` is added as a sibling after `</main>`, matching the semantic expectation that a footer is a page-level landmark outside the main content flow, not part of it.

**Interaction states reuse existing Tailwind conventions:** `hover:border-accent/50` / `hover:text-accent` already appear across Skills/Education/Certifications; Contact's links reuse the same accent-on-hover treatment, adding `focus-visible:outline` (or an accent ring) since no prior section has a focusable link element to establish that pattern yet — this design introduces it once here, consistently, rather than each link inventing its own focus style.

## Risks / Trade-offs

- [Footer duplicates Contact's link data in a second location on the page] → Accepted; both read from the same single `profile.contact` source, so there is one place to update, not two — the duplication is only visual/DOM, not a data-maintenance burden.
- [No GitHub link, despite the proposal explicitly asking for one "quando disponível"] → Accepted; not available in the reference resume or project config, and the proposal itself frames GitHub as conditional on availability. Adding a fabricated one would violate the project's core no-fabrication rule.
- [`<footer>` sits outside `<main>` in `page.tsx`, a layout change slightly larger than prior single-section additions] → Accepted; this is the semantically correct placement for a page footer and does not alter any existing section's markup or behavior.
