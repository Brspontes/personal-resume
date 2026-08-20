## Why

The project currently has no application structure. Before implementing the actual resume content and UI, we need to establish the initial technical foundation: a working Next.js application configured with the project's required technology stack (TypeScript, Tailwind CSS, Node.js 24.19.0), so that subsequent features have a stable base to build on.

## What Changes

- Initialize a Next.js application using TypeScript.
- Configure Tailwind CSS.
- Pin the Node.js version to 24.19.0 for the project.
- Establish the initial project directory structure (`public/`, `src/app/`, `src/components/`, `src/data/`).
- Create the initial application entry point.
- Create a minimal homepage displaying a "Hello World" message.
- Ensure the application can be started locally (dev server).
- Ensure the application can be built successfully (production build).
- Keep the initial implementation intentionally minimal — no resume content, sections, or business logic yet.

## Capabilities

### New Capabilities
- `project-foundation`: Baseline Next.js + TypeScript + Tailwind CSS application scaffold, including project structure, entry point, and a minimal homepage, that starts and builds successfully.

### Modified Capabilities
- None. This is the first change in the project; there are no existing specs to modify.

## Impact

- Affected code: entire project (currently empty `src/`), new `package.json`, `tsconfig.json`, Tailwind config, and Next.js config files at the repository root.
- Affected systems: local development workflow (dev server) and build pipeline (production build).
- No existing functionality is affected, since none exists yet.
