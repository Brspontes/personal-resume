## Purpose

The Hero is the homepage's primary introduction to the developer, giving every visitor an immediate, accurate summary of who they are and clear next actions before any other section loads.

## ADDED Requirements

### Requirement: Developer Identity Display
The Hero SHALL display the developer's name and professional title, sourced from the project's reference resume document.

#### Scenario: Visitor views the Hero
- **WHEN** a visitor loads the homepage
- **THEN** the Hero displays the developer's name and professional title

### Requirement: Professional Summary
The Hero SHALL display a concise professional summary that is based strictly on the reference resume document and does not reproduce the full document verbatim.

#### Scenario: Visitor reads the summary
- **WHEN** a visitor views the Hero
- **THEN** a short professional summary is displayed that reflects the developer's real experience and technical focus without copying the resume text as-is

### Requirement: Primary CTA to Experience
The Hero SHALL provide a primary call-to-action that navigates the visitor toward the professional experience content of the site.

#### Scenario: Visitor activates the primary CTA
- **WHEN** a visitor activates the "view experience" call-to-action
- **THEN** the page navigates or scrolls toward the experience section's designated location

### Requirement: Secondary CTA to Download CV
The Hero SHALL provide a secondary call-to-action that lets the visitor download the developer's CV as a file.

#### Scenario: Visitor activates the download CTA
- **WHEN** a visitor activates the "download CV" call-to-action
- **THEN** the developer's CV file is downloaded or opened by the browser

### Requirement: Hero Visual Element
The Hero SHALL include a main visual element reserved for the developer's photo, rendered even before a real photo is supplied.

#### Scenario: Visual element renders without a real photo
- **WHEN** a visitor views the Hero before a real photo has been provided
- **THEN** a placeholder visual element is displayed in the photo's intended position and proportions, with no broken image or empty gap

### Requirement: Responsive Hero Layout
The Hero SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** the Hero's text, CTAs, and visual element remain readable and usable without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** the Hero's text, CTAs, and visual element are laid out using the available width without appearing sparse or misaligned
