## 1. Data

- [x] 1.1 Add the `CertificationEntry` interface (`id`, `name`, optional `issuer`, `issuedAt`, `expiresAt`, `credentialId`, `credentialUrl`) to `src/data/profile.ts`.
- [x] 1.2 Add the `certifications: CertificationEntry[]` field to the `Profile` interface.
- [x] 1.3 Populate `profile.certifications` with the five certifications from the reference resume, name only (no fabricated issuer, dates, credential ID, or link): "Rest com NodeJs: API com Express e MySQL", "Modelagem de Domínios Ricos", "AWS Certified Cloud Practitioner", "Android I: Crie sua App fantástica com Android Studio - 10 horas", "Aplicações Serverless na AWS".

## 2. Component

- [x] 2.1 Create `src/components/Certifications.tsx` as a Server Component, structurally modeled on `Skills.tsx` (`// Certifications` mono label, heading, `bg-grid-pattern` section wrapper, wrapping card grid).
- [x] 2.2 Render one card per `profile.certifications` entry showing the certification name.
- [x] 2.3 Render `issuer`, `issuedAt`/`expiresAt`, and `credentialId` on a card only when present on that entry, with no placeholder for missing fields.
- [x] 2.4 Render `credentialUrl`, when present, as a clickable link (`target="_blank"`, `rel="noopener noreferrer"`) that opens the credential's verification page.
- [x] 2.5 Implement a responsive wrapping card layout (mobile through desktop) consistent with the section's own requirement and the rest of the homepage.

## 3. Integration

- [x] 3.1 Render `<Certifications />` in `src/app/page.tsx` after `<Education />`.

## 4. Validation

- [x] 4.1 Run the build and TypeScript compilation and confirm no errors.
- [x] 4.2 Run the linter and confirm no errors.
- [x] 4.3 Visually verify the section on mobile, tablet, and desktop viewport widths.
- [x] 4.4 Confirm all five certifications display by name only, with no fabricated issuer, dates, credential ID, or link, and no academic degree appears in the section.
