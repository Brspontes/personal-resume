## 1. Data

- [x] 1.1 Add a `highlights: { value: string; label: string }[]` field to `Profile` in `src/data/profile.ts`, populated with the four highlights defined in design.md (Anos de Experiência, Empresas, Certificações, Idiomas).

## 2. Component

- [x] 2.1 Create `src/components/ProfessionalHighlights.tsx` as a Server Component rendering the `highlights` array from `profile.ts`.
- [x] 2.2 Style each highlight as a value/label pair using the Hero's established visual language (mono/accent typography, existing color tokens).
- [x] 2.3 Implement the responsive grid (2 columns mobile/tablet, 4 columns desktop) with Tailwind utilities.

## 3. Integration

- [x] 3.1 Render `<ProfessionalHighlights />` in `src/app/page.tsx` immediately after `<Hero />`.

## 4. Validation

- [x] 4.1 Verify the app builds successfully and TypeScript compiles with no errors.
- [x] 4.2 Check for linting errors.
- [x] 4.3 Visually verify the section in the browser at mobile, tablet, and desktop widths.
- [x] 4.4 Confirm each displayed highlight value matches the exact count/statement documented in design.md against the reference resume.
