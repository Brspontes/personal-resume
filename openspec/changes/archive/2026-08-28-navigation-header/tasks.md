## 1. Anchor Targets and Global Scroll Behavior

- [x] 1.1 Add `id="home"` to the `Hero.tsx` section element (no visual change).
- [x] 1.2 Add `id="highlights"` to the `ProfessionalHighlights.tsx` section element (no visual change).
- [x] 1.3 Add `scroll-behavior: smooth` and a `scroll-padding-top` matching the header's height to the root `html` element in `globals.css`.

## 2. Mobile Navigation Toggle

- [x] 2.1 Create `src/components/MobileNav.tsx` as a Client Component (`"use client"`) with open/closed state.
- [x] 2.2 Render a toggle button with `aria-expanded` and `aria-controls` wired to the link list, and an accessible name (e.g. "Abrir menu" / "Fechar menu").
- [x] 2.3 Render the collapsible list of section links, hidden when closed and visible when open.
- [x] 2.4 Close the menu when a link inside it is activated.
- [x] 2.5 Add visible `hover:` and `focus-visible:` states to the toggle button and every link.

## 3. Header Component

- [x] 3.1 Create `src/components/Header.tsx` as a Server Component rendering a `<header>` with `sticky top-0` positioning and a translucent/blurred background.
- [x] 3.2 Render the logo/name element (reusing the initials-badge convention from `Hero.tsx`) linking to `#home`.
- [x] 3.3 Render the desktop `<nav>` with links to all seven sections (Início, Destaques, Experiência, Habilidades, Educação, Certificações, Contato → `#home`, `#highlights`, `#experience`, `#skills`, `#education`, `#certifications`, `#contact`), visible at desktop widths and hidden at mobile widths.
- [x] 3.4 Render `<MobileNav />` for mobile widths, hidden at desktop widths.
- [x] 3.5 Add visible `hover:` and `focus-visible:` states to every desktop link and the logo/name link.

## 4. Integration

- [x] 4.1 Render `<Header />` in `src/app/page.tsx` as the first element, before `<main>`.

## 5. Validation

- [x] 5.1 Run the build and TypeScript compilation and confirm no errors.
- [x] 5.2 Run the linter and confirm no errors.
- [x] 5.3 Visually verify the header on mobile, tablet, and desktop viewport widths, including opening and closing the mobile menu.
- [x] 5.4 Confirm every nav link scrolls to its section with the section's top content not hidden under the header, hover/focus states are visible on every link and the mobile toggle, the toggle's `aria-expanded` state updates correctly, and no existing section's appearance or behavior changed.
