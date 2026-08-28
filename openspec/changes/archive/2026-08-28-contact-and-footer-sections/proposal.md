## Why

Hero, Professional Highlights, Professional Experience, Skills, Education, and Certifications are implemented. The homepage still has no way for a visitor to reach out or find the developer's professional profiles, and no closing footer — the page currently just stops after Certifications. Contact and Footer are the final two sections needed to complete the portfolio.

## What Changes

- Add a new `Contact` section, rendered on the homepage after Certifications, with a short call-to-action and clickable links to the developer's real contact channels sourced from the reference resume (`D:/Development/Profile.pdf`):
  - Email: `brian.robert16@hotmail.com` (opens the visitor's email client via `mailto:`)
  - LinkedIn: `https://www.linkedin.com/in/brianpontes-420675a4`
  - Personal website: `https://www.brianpontes.com.br/`
  - No GitHub link is added: the reference resume does not list one, and none exists elsewhere in the project's configuration, so per the no-fabrication rule it is omitted rather than guessed.
- Each contact link gets visible hover and focus states, consistent with the interactive elements already in the site (e.g. card hover borders in Skills/Education/Certifications).
- No contact form, backend, or API — links only.
- Add a new `Footer` component, rendered as the last element on the page, showing the developer's name, role, the same contact links as Contact (reused, not duplicated content), and a copyright line with the current year.
- Extend `src/data/profile.ts` with the typed contact channel data sourced from the reference resume, following the same no-fabrication rule as prior sections.
- Implement both sections responsively, consistent with the visual language already established in the rest of the homepage.

## Capabilities

### New Capabilities
- `contact-section`: A call-to-action with clickable links to the developer's real contact channels (email, LinkedIn, personal website), each with hover/focus states, sourced from the reference resume.
- `footer`: A minimal closing footer showing the developer's name, role, contact links, and an up-to-date copyright year.

### Modified Capabilities
_None._ Hero, Professional Highlights, Professional Experience, Skills, Education, and Certifications requirements are unchanged; these sections are additive.

## Impact

- New component: `src/components/Contact.tsx`.
- New component: `src/components/Footer.tsx`.
- Modified data file: `src/data/profile.ts` (adds typed contact channel data: email, LinkedIn URL, website URL).
- Modified page: `src/app/page.tsx` (renders `<Contact />` after `<Certifications />`, and `<Footer />` as the last element).
- No changes to existing Hero, Professional Highlights, Professional Experience, Skills, Education, or Certifications behavior.
