## 1. Content Source

- [x] 1.1 Create `src/data/profile.ts` exporting a typed profile object (name, title, summary, location) with content drafted from `D:/Development/Profile.pdf` (Portuguese), following the "Content Presentation" rules in proposal.md (concise, not a verbatim copy, based strictly on the source).
- [x] 1.2 Copy `D:/Development/Profile.pdf` to `public/cv.pdf` for the download CTA.

## 2. Hero Component

- [x] 2.1 Create `src/components/Hero.tsx` as a Server Component that reads from `src/data/profile.ts`.
- [x] 2.2 Render name, professional title, and professional summary.
- [x] 2.3 Add primary CTA ("Ver experiência") linking to `#experience`.
- [x] 2.4 Add secondary CTA ("Baixar CV") linking to `/cv.pdf` with the `download` attribute.
- [x] 2.5 Add the visual placeholder element (developer photo slot) sized with a fixed aspect ratio.

## 3. Layout and Styling

- [x] 3.1 Implement the Hero's responsive layout (mobile, tablet, desktop) using Tailwind utilities, visually inspired by https://zelio-nextjs.vercel.app/index-2 without copying its code or assets.
- [x] 3.2 Wire `Hero` into `src/app/page.tsx`, replacing the current "Hello World" placeholder content.

## 4. Verification

- [x] 4.1 Run the dev server and visually confirm the Hero renders correctly at mobile, tablet, and desktop widths.
- [x] 4.2 Confirm the primary CTA is a link targeting `#experience` and the secondary CTA downloads `public/cv.pdf`.
- [x] 4.3 Confirm the visual placeholder renders with no broken image or empty gap.
- [x] 4.4 Run the production build and confirm it completes with no TypeScript or build errors.
