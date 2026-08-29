## Purpose

Defines the browser tab title and favicon that identify the site as Brian Pontes's professional portfolio.

## ADDED Requirements

### Requirement: Browser Tab Title
The system SHALL set the page title metadata to "Brian Pontes".

#### Scenario: Visitor views the browser tab
- **WHEN** a visitor loads any page of the site
- **THEN** the browser tab displays the title "Brian Pontes"

### Requirement: Browser Tab Icon
The system SHALL use `public/code.png` as the site's favicon.

#### Scenario: Visitor views the browser tab icon
- **WHEN** a visitor loads any page of the site
- **THEN** the browser tab displays the icon sourced from `public/code.png`
