# personal-resume

## Project Overview

Personal resume and professional portfolio website for a software developer.

The purpose of this project is to present professional experience, career history, technical skills, projects, education, certifications, and other relevant professional information in a modern, clear, and accessible web interface.

The website should function as both an online resume and a professional portfolio.

## Communication Language

- Communicate with the user in Brazilian Portuguese.
- All explanations, progress reports, summaries, questions, and recommendations must be written in Brazilian Portuguese.
- Code, code comments, variable names, function names, component names, file names, commit messages, and technical identifiers should remain in English.
- When referencing technical concepts, use the commonly accepted English terminology when appropriate.
- Do not translate code identifiers or framework-specific terminology unnecessarily.

## Reference Documents

The following documents are provided as source material for the project:

- `D:/Development/Profile.pdf` — Contains the developer's professional history, experience, education, skills, certifications, and other career information.

Use `D:/Development/Profile.pdf` as the primary source of truth for professional information when implementing the resume.

### Rules

- Read and analyze the PDF when professional information is required.
- Do not fabricate information that is not present in the source document.
- Do not assume missing dates, companies, roles, technologies, or achievements.
- Preserve the accuracy of the information provided in the source document.
- The PDF is a reference document and must not be displayed or exposed as part of the website.
- When information is ambiguous or missing, ask for clarification before making assumptions.

## Technology Stack

- Node.js 24.19.0
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Context API, only when global state management is actually required

Do not introduce additional libraries or frameworks unless there is a clear technical justification.

## Architecture

The application will be developed as a single Next.js application.

The codebase must be componentized and organized around clear responsibilities.

Each major section of the website should be implemented as an independent component when appropriate.

Expected sections may include:

- Header
- Hero
- About
- Experience
- Skills
- Education
- Certifications
- Projects
- Contact
- Footer

### General Principles

- Follow the Single Responsibility Principle.
- Prefer composition over unnecessary inheritance or abstraction.
- Keep components small and focused.
- Separate presentation from business logic when appropriate.
- Reuse components when there is a genuine need for shared behavior or structure.
- Avoid premature abstractions.
- Prefer simple solutions over unnecessary complexity.

## Development Guidelines

### Code Quality

- Do not duplicate code.
- Prioritize readability and maintainability.
- Use TypeScript consistently.
- Avoid `any` whenever possible.
- Use meaningful and descriptive names.
- Keep functions and components focused on a single responsibility.
- Avoid unnecessary dependencies.
- Prefer existing project utilities and components before introducing new ones.
- Do not introduce abstractions unless they provide clear value.

### Components

- Components should have a clear and well-defined responsibility.
- Avoid unnecessarily large components.
- Prefer reusable components when appropriate.
- Define explicit and meaningful prop types.
- Keep business logic out of presentation components when possible.
- Avoid unnecessary state.
- Prefer derived values over duplicated state.

### Styling

- Use Tailwind CSS for styling.
- Avoid duplicated styling rules.
- Maintain visual consistency across the application.
- Follow a consistent spacing, typography, and layout system.
- The application must be responsive.
- Mobile-first design should be preferred when appropriate.
- Prioritize accessibility and usability.

## Design Reference

The primary visual reference for the project is:

- https://zelio-nextjs.vercel.app/index-2

Use this website as a visual and structural reference for:

- Overall layout
- Visual hierarchy
- Typography
- Spacing
- Section organization
- Animations
- Interactions
- General visual style

The reference website should not be copied directly.

Do not copy its content, branding, assets, or proprietary implementation. Use it only as inspiration for the visual direction and user experience.

## Content Integrity

All professional information displayed on the website must be accurate and provided by the project owner.

Never fabricate:

- Professional experience
- Companies
- Job titles
- Projects
- Technologies
- Certifications
- Education
- Achievements
- Metrics or business results

If required information is missing, ask for the information instead of making assumptions.

## Accessibility

Accessibility should be considered during implementation.

At minimum:

- Use semantic HTML.
- Provide meaningful `alt` text for relevant images.
- Ensure interactive elements are keyboard accessible.
- Maintain sufficient color contrast.
- Use appropriate heading hierarchy.
- Do not rely exclusively on color to communicate information.
- Provide accessible labels for form controls and interactive elements.

## Performance

Performance should be considered during development.

- Avoid unnecessary client-side rendering.
- Prefer Server Components when client-side interactivity is not required.
- Use Client Components only when necessary.
- Optimize images and static assets.
- Avoid unnecessary JavaScript.
- Avoid unnecessary re-renders.
- Do not add libraries that significantly increase bundle size without justification.

## Responsive Design

The website must work correctly across:

- Mobile devices
- Tablets
- Laptops
- Desktop screens
- Large displays

Do not implement desktop-only layouts.

Every new visual component should be evaluated at different viewport sizes.

## Validation

Before considering a change complete:

1. Verify that the application builds successfully.
2. Verify TypeScript compilation.
3. Check for linting errors.
4. Verify the affected functionality.
5. Verify responsive behavior.
6. Check basic accessibility.
7. Check for unnecessary code duplication.
8. Confirm that existing functionality has not been unintentionally affected.

## Change Management

Before making significant changes:

1. Understand the existing project structure.
2. Inspect existing components and utilities.
3. Determine whether an existing solution can be reused.
4. Avoid unrelated refactoring.
5. Keep changes focused on the requested objective.
6. Preserve established architectural patterns.

Do not change frameworks, libraries, architecture, or project conventions without a clear reason.

## Git Guidelines

Keep changes small and focused.

Avoid combining unrelated changes in the same implementation.

For example, do not combine:

- Feature development
- Unrelated refactoring
- Visual redesign
- Dependency upgrades
- Architecture changes

unless they are directly required by the same objective.

Commit messages should clearly describe the purpose of the change.

## Decision Making

When multiple valid implementation approaches exist:

1. Prefer the simplest solution.
2. Prefer existing project patterns.
3. Prefer native framework capabilities.
4. Prefer maintainability over cleverness.
5. Avoid introducing dependencies for simple problems.
6. Consider accessibility and performance.
7. Follow the project's existing conventions.

When requirements are ambiguous or critical information is missing, ask for clarification instead of making assumptions.

## Scope Control

Only modify files that are relevant to the requested change.

Do not:

- Perform unrelated refactoring.
- Change dependencies without justification.
- Rename files without a reason.
- Rewrite working code unnecessarily.
- Introduce new architectural patterns without need.
- Modify configuration files unless required.

The goal is to make the smallest safe change that fully solves the requested problem.

## Future Development

As the project evolves, preserve consistency with the principles defined in this document.

New functionality should integrate with the existing architecture rather than creating parallel patterns.

If an existing pattern becomes clearly inadequate, propose the architectural change before implementing it.
