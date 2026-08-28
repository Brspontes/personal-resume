## Why

Hero, Professional Highlights, Professional Experience, and Skills are implemented. About Me was dropped because those sections already cover the professional profile sufficiently. The next step is a dedicated Education section presenting the developer's academic background, complementing the professional information already shown without repeating it.

## What Changes

- Add a new `Education` section, rendered on the homepage after Skills, presenting academic background as cards.
- Populate it strictly with the academic entries found in the reference resume (`D:/Development/Profile.pdf`):
  - MBA Arquitetura de Software e Soluções — Instituto de Gestão e Tecnologia da Informação (julho de 2021 – outubro de 2022).
  - Bacharelado em Ciência da Computação — Universidade Paulista (2013 – 2016).
- Order entries chronologically, most recent first, and visually highlight the most recent one (the MBA).
- Exclude certifications and free/short courses (e.g. AWS Certified Cloud Practitioner, Alura courses) from this section — those belong to a future, dedicated section.
- Extend `src/data/profile.ts` with a typed education entries array sourced from the reference resume, following the same no-fabrication rule as prior sections.
- Implement a responsive card layout consistent with the visual language already established in Hero, Professional Experience, and Skills.

## Capabilities

### New Capabilities
- `education-section`: Card-based display of the developer's academic background (degree, institution, period, and highlight for the most recent entry), sourced from the reference resume, ordered chronologically.

### Modified Capabilities
_None._ Hero, Professional Highlights, Professional Experience, and Skills requirements are unchanged; this section is additive.

## Impact

- New component: `src/components/Education.tsx`.
- Modified data file: `src/data/profile.ts` (adds a typed `education` entries array).
- Modified page: `src/app/page.tsx` (renders the new section after `<Skills />`).
- No changes to existing Hero, Professional Highlights, Professional Experience, or Skills behavior.
