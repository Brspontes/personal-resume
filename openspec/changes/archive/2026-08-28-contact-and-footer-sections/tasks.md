## 1. Data

- [x] 1.1 Add the `ContactChannel` and `Contact` interfaces to `src/data/profile.ts`.
- [x] 1.2 Add the `contact: Contact` field to the `Profile` interface.
- [x] 1.3 Populate `profile.contact` with the developer's real channels: email `brian.robert16@hotmail.com`, LinkedIn `https://www.linkedin.com/in/brianpontes-420675a4`, and personal website `https://www.brianpontes.com.br/`. No GitHub entry (not present in the reference resume or project configuration).

## 2. Contact Component

- [x] 2.1 Create `src/components/Contact.tsx` as a Server Component, structurally modeled on the existing sections (`// Contact` mono label, heading with a short call-to-action, `bg-grid-pattern` section wrapper).
- [x] 2.2 Render the email as a `mailto:` link built from `profile.contact.email`.
- [x] 2.3 Render each `profile.contact.channels` entry as a link with `target="_blank"` and `rel="noopener noreferrer"`.
- [x] 2.4 Add visible `hover:` and `focus-visible:` states to every contact link, reusing the accent treatment already used elsewhere in the site.
- [x] 2.5 Implement a responsive layout (mobile through desktop) consistent with the section's own requirement and the rest of the homepage.

## 3. Footer Component

- [x] 3.1 Create `src/components/Footer.tsx` as a Server Component rendering a `<footer>` element (not a `<section>`).
- [x] 3.2 Display `profile.name` and `profile.role`.
- [x] 3.3 Render the same `profile.contact` links as Contact, styled subdued/minimal (no card chrome), so the Footer does not visually compete with the Contact section.
- [x] 3.4 Render a copyright line using `new Date().getFullYear()` so the year is always current without a manual update.
- [x] 3.5 Implement a responsive layout (mobile through desktop) consistent with the section's own requirement.

## 4. Integration

- [x] 4.1 Render `<Contact />` in `src/app/page.tsx` as the last child inside `<main>`, after `<Certifications />`.
- [x] 4.2 Render `<Footer />` in `src/app/page.tsx` as a sibling after `</main>` (outside the main content flow).

## 5. Validation

- [x] 5.1 Run the build and TypeScript compilation and confirm no errors.
- [x] 5.2 Run the linter and confirm no errors.
- [x] 5.3 Visually verify both sections on mobile, tablet, and desktop viewport widths.
- [x] 5.4 Confirm the email link opens a `mailto:` action, LinkedIn and website links open correctly as external links, hover/focus states are visible, no contact form or GitHub link is present, and the Footer's copyright year matches the current year.
