## Context

See proposal.md - Why. `src/app/page.tsx` currently renders `Hero`, `ProfessionalHighlights`, `ProfessionalExperience`, `Skills`, `Education`, `Certifications`, and `Contact` inside `<main>`, with `Footer` as a sibling after `</main>`. Every section except `Hero` and `ProfessionalHighlights` already has a stable `id` (`#experience`, `#skills`, `#education`, `#certifications`, `#contact`).

The project already has one precedent for isolating client-side interactivity inside an otherwise server-rendered section: `ProfessionalExperience.tsx` (Server Component) renders `ExperienceNavigator.tsx` (`"use client"`, uses `useState`) for the one piece that needs it. This change follows the same split.

The site's visible section headings are Portuguese (e.g. "Experiência Profissional", "Habilidades Técnicas", "Formação Acadêmica", "Certificações", "Vamos conversar?"); the small mono-styled labels above each heading are a mix of English and Portuguese (e.g. `// Skills`, `// Trajetória`). There is no existing site logo image — `Hero.tsx` represents the developer's identity with a text initials badge (`profile.name` initials, e.g. "BP").

## Goals / Non-Goals

**Goals:**
- Keep `Header.tsx` a Server Component; isolate only the mobile open/close toggle in a small Client Component (`MobileNav.tsx`), mirroring the `ProfessionalExperience`/`ExperienceNavigator` split.
- Implement smooth, header-offset-aware anchor scrolling with plain CSS (`scroll-behavior: smooth` + `scroll-padding-top` on the root element) — no scroll library, no JS scroll handling, and it automatically respects the OS-level reduced-motion preference in supporting browsers, directly satisfying the spec's reduced-motion scenario without extra code.
- Reuse the existing initials-badge convention from `Hero.tsx` for the header's "Logo / Name" element, instead of inventing a new visual identity or fabricating a logo asset that does not exist.
- Reuse the site's established Portuguese, heading-level copy for nav labels (Início, Destaques, Experiência, Habilidades, Educação, Certificações, Contato) rather than the proposal's example English list, for consistency with every other visible section label already on the page.

**Non-Goals:**
- Does not implement a scroll-triggered visual change to the header itself (shrinking, background fade-in, etc.) — the proposal frames this as optional, and it has no CSS-only implementation, so adding it would mean promoting the whole header to a Client Component with a scroll listener for a cosmetic effect no requirement depends on.
- Does not highlight the "currently active" section in the nav as the visitor scrolls — not requested by the proposal or spec, and would require scroll-position tracking (client-side, cross-cutting with every section) for a feature nobody asked for.
- Does not change Professional Experience, Skills, Education, Certifications, Contact, or Footer.
- Does not add a real logo image/SVG asset — none exists in the project, and fabricating brand iconography for a personal resume site is out of scope.

## Decisions

**Anchor scroll offset via global CSS, not per-section classes.** Adding `scroll-padding-top: <header-height>` to the root `html` element (alongside `scroll-behavior: smooth`) in `globals.css` makes every `href="#id"` jump — from any current or future section — automatically stop below the sticky header. This is one small addition to one file, versus adding a `scroll-mt-*` utility class to six-plus existing section components individually. Both `scroll-behavior: smooth` and `scroll-padding-top` are widely supported CSS properties; `scroll-behavior: smooth` is automatically suppressed by browsers when the OS requests reduced motion, which is what satisfies the spec's "reduced-motion preference" scenario for free.

**Header height is fixed and known at build time** (a single Tailwind height utility, e.g. `h-16`), so `scroll-padding-top` can reference the same value directly (as a small CSS custom property or literal `4rem`) — no runtime measurement of the header's rendered height is needed.

**`id="home"` on Hero, `id="highlights"` on ProfessionalHighlights.** These are the only two sections in the nav list without an existing anchor target. Adding a bare `id` attribute is not a content or visual change, so it does not touch either section's existing spec requirements (see proposal.md - Modified Capabilities).

**Component structure:**
- `src/components/Header.tsx` — Server Component, default export. Renders a `<header className="sticky top-0 z-50 ...">` with a translucent/blurred background (`bg-background/80 backdrop-blur`) so section content scrolling underneath stays legible, consistent with the "discreet, does not compete with Hero" requirement. Contains: the initials badge + `profile.name` (linking to `#home`) on the left, a `<nav>` with the seven links rendered inline for desktop (hidden below the `sm`/`md` breakpoint via Tailwind), and `<MobileNav />` for the toggle + mobile link list (hidden at desktop width).
- `src/components/MobileNav.tsx` — `"use client"`, the only stateful piece (`useState` for open/closed). Renders a `button` with `aria-expanded` and `aria-controls` pointing at the link-list `id`, and the collapsible link list itself. Closing on link activation (so choosing a section also closes the mobile menu) is a small, expected UX behavior directly implied by the "compact navigation adequate to mobile space" requirement — not scope creep, since leaving the menu open after navigating would fail that requirement's spirit on return visits to the header.

**Page integration:** `src/app/page.tsx` renders `<Header />` as the first element, before `<main>`, mirroring how `<Footer />` already sits after `</main>` — both are page-level landmarks outside the scrolling content flow, not additional `<main>` children.

**Nav link data lives inline in `Header.tsx`**, not in `profile.ts`: unlike `experiences`/`education`/`certifications`/`contact`, the nav list is a fixed structural/UI concern (which sections exist and in what order), not resume content sourced from the reference document — it does not belong in the content-only data file per the project's established `profile.ts` convention (plain content, no structural/UI concerns).

## Risks / Trade-offs

- [Fixed `scroll-padding-top` value must stay in sync with the header's actual rendered height if that height ever changes] → Accepted; the header's height is a single Tailwind utility class defined once in `Header.tsx`, so keeping the two in sync is a one-line edit in one file, not a distributed concern.
- [No scroll-triggered header style change, despite being explicitly mentioned in the proposal] → Accepted; the proposal itself frames it as optional ("caso contribua"), and omitting it keeps `Header.tsx` a Server Component — a deliberate trade-off favoring the project's stated preference for Server Components over a cosmetic scroll effect.
- [`backdrop-blur` has minor performance cost on low-end devices while scrolling] → Accepted; this is a single fixed-position element, not a per-section effect, and is the standard pattern for a legible sticky header over scrolling content.
