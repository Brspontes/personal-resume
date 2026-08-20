## 1. Application Scaffold

- [x] 1.1 Scaffold the Next.js application with TypeScript and Tailwind CSS (App Router, `src/` directory) at the repository root.
- [x] 1.2 Review the generated `package.json`, `tsconfig.json`, Tailwind/PostCSS config, and ESLint config, and remove/adjust anything not aligned with CLAUDE.md conventions.

## 2. Node.js Version Pinning

- [x] 2.1 Add `"engines": { "node": "24.19.0" }` to `package.json`.
- [x] 2.2 Add a `.nvmrc` file at the repository root containing `24.19.0`.

## 3. Project Structure

- [x] 3.1 Ensure `src/app/`, `src/components/`, and `src/data/` directories exist (creating `components/` and `data/` with a placeholder if needed, since Next.js scaffolding only creates `app/`).
- [x] 3.2 Verify `public/` exists for static assets.

## 4. Homepage

- [x] 4.1 Implement `src/app/page.tsx` as a Server Component rendering a "Hello World" message.
- [x] 4.2 Apply at least one Tailwind utility class in the homepage to confirm Tailwind CSS is wired up correctly.

## 5. Verification

- [x] 5.1 Run the local dev server and confirm the homepage loads with the "Hello World" message.
- [x] 5.2 Run the production build and confirm it completes with no TypeScript or build errors.
- [x] 5.3 Confirm the project structure matches `public/`, `src/app/`, `src/components/`, `src/data/` as specified in the proposal.
