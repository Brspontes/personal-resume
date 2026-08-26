# Personal Resume

Personal resume and professional portfolio website, built to present professional experience, skills, and career history in a modern, developer-styled web interface.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-icons](https://react-icons.github.io/react-icons/) for technology logos

## Getting Started

Requires Node.js `24.19.0` (see `engines` in `package.json`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Project Structure

```
src/
  app/
    layout.tsx          # root layout, fonts, metadata
    page.tsx             # homepage — composes all sections
    globals.css           # design tokens, dot-grid background
  components/
    Hero.tsx                     # intro, headline, tech stack
    ProfessionalHighlights.tsx    # key stats (years, companies, certs, languages)
    ProfessionalExperience.tsx    # company navigator + detail panel
    ExperienceNavigator.tsx       # client-side interactive experience selector
    HighlightCounter.tsx          # animated stat counter
    Skills.tsx                    # flat grid of skill cards (logo or text fallback)
  data/
    profile.ts           # single source of truth for all displayed content
```

All page content lives in `src/data/profile.ts`, sourced from the developer's actual resume — components are presentation-only over this data.

## OpenSpec Workflow

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) for spec-driven change planning. Proposed and completed changes live under `openspec/`:

- `openspec/specs/` — current capability specs (source of truth for behavior)
- `openspec/changes/` — active change proposals
- `openspec/changes/archive/` — completed, archived changes
