## Why

Hero, Professional Highlights, Professional Experience, Skills, and Education are implemented. The reference resume also lists five professional certifications that are not represented anywhere on the site yet. A dedicated Certifications section fills that gap, complementing Education (formal degrees) and Skills (technologies) without repeating either.

## What Changes

- Add a new `Certifications` section, rendered on the homepage after Education, presenting each certification as a reusable card.
- Populate it strictly with the five certifications listed in the reference resume (`D:/Development/Profile.pdf`), each shown by name only:
  - Rest com NodeJs: API com Express e MySQL
  - Modelagem de Domínios Ricos
  - AWS Certified Cloud Practitioner
  - Android I: Crie sua App fantástica com Android Studio - 10 horas
  - Aplicações Serverless na AWS
- The reference resume's "Certifications" list contains only certification names — no issuing organization, dates, credential ID, or verification link is present for any entry. Per explicit user decision, no such fields are fabricated or inferred: cards display the certification name only, and no issuer/date/credential-ID/link UI is built since there is no real data to populate it with.
- Extend `src/data/profile.ts` with a typed certifications entries array sourced from the reference resume, following the same no-fabrication rule as prior sections.
- Implement a responsive card layout consistent with the visual language already established in Hero, Professional Experience, Skills, and Education.

## Capabilities

### New Capabilities
- `certifications-section`: Card-based display of the developer's professional certifications (name only, per current source-data availability), sourced from the reference resume.

### Modified Capabilities
_None._ Hero, Professional Highlights, Professional Experience, Skills, and Education requirements are unchanged; this section is additive.

## Impact

- New component: `src/components/Certifications.tsx`.
- Modified data file: `src/data/profile.ts` (adds a typed `certifications` entries array).
- Modified page: `src/app/page.tsx` (renders the new section after `<Education />`).
- No changes to existing Hero, Professional Highlights, Professional Experience, Skills, or Education behavior.
