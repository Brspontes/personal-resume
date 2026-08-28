## Why

Hero, Professional Highlights, Professional Experience, Skills, Education, Certifications, Contact, and Footer are all implemented, but the homepage has no way to jump directly to a section — a visitor must scroll through the entire page manually. A sticky navigation header lets a visitor reach any section in one click, completing the page's navigation experience.

## What Changes

- Add a new `Header` component, rendered at the top of the page (sticky/fixed during scroll), with anchor links to each major section: Home, Professional Highlights, Professional Experience, Skills, Education, Certifications, and Contact.
- Displayed nav labels are shortened to match the site's existing Portuguese, user-facing copy (the mono-styled labels are English/technical, e.g. `// Trajetória`, but the visible headings are Portuguese, e.g. "Experiência Profissional", "Habilidades Técnicas") rather than reusing the proposal's example English names verbatim:
  - Home → Início
  - Professional Highlights → Destaques
  - Professional Experience → Experiência
  - Skills → Habilidades
  - Education → Educação
  - Certifications → Certificações
  - Contact → Contato
- Clicking a nav link smoothly scrolls to the corresponding section without the sticky header covering the section's top content.
- On mobile, the navigation collapses into a compact toggle (hamburger) that opens/closes a list of the same links, with accessible keyboard and screen-reader behavior.
- Every nav link and the mobile toggle control have visible hover and focus states.
- The header is visually discreet (small, subdued) and does not compete with the Hero section below it.
- Two existing sections (Hero, Professional Highlights) currently have no anchor `id` — they gain one so every nav link has a real target. This is an additive `id` attribute only; no visual or content change to either section.
- No scroll-triggered visual change to the header (e.g. shrinking or a background change on scroll) is added: the proposal frames it as optional ("caso contribua"), and it would require client-side scroll listening for a purely cosmetic effect the header does not need to satisfy any requirement.

## Capabilities

### New Capabilities
- `navigation-header`: A sticky header with anchor-based navigation to every major homepage section, responsive between a desktop link row and a mobile toggle menu, with visible hover/focus states and accessible keyboard/screen-reader support.

### Modified Capabilities
_None._ Hero and Professional Highlights gain an `id` attribute to serve as anchor targets, but neither section's existing spec requirements (visual content, layout, behavior) change — the new navigable-target behavior is a requirement of the new `navigation-header` capability, not a change to what Hero or Professional Highlights themselves must display.

## Impact

- New component: `src/components/Header.tsx`.
- New component: `src/components/MobileNav.tsx` (the only client-interactive piece — the open/close toggle — isolated from the otherwise server-rendered header, following the project's existing pattern of `ProfessionalExperience.tsx` + `ExperienceNavigator.tsx`).
- Modified component: `src/components/Hero.tsx` (adds `id="home"`, no visual change).
- Modified component: `src/components/ProfessionalHighlights.tsx` (adds `id="highlights"`, no visual change).
- Modified page: `src/app/page.tsx` (renders `<Header />` before `<main>`, mirroring how `<Footer />` already sits after `</main>`).
- Modified stylesheet: `src/app/globals.css` (adds smooth scrolling and a scroll offset so the sticky header never covers a section's top on anchor navigation).
- No changes to existing Professional Experience, Skills, Education, Certifications, Contact, or Footer behavior.
