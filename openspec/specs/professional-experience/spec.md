# professional-experience Specification

## Purpose

The Professional Experience section lets homepage visitors browse the developer's career history company by company, sourced strictly from the reference resume document, using an interactive navigation instead of a static timeline.

## Requirements

### Requirement: Company Navigation
The Professional Experience section SHALL provide a visual navigation element per company, sourced from the reference resume document, ordered from most recent to least recent.

#### Scenario: Visitor views the company navigation
- **WHEN** a visitor loads the Professional Experience section
- **THEN** a navigation element is displayed for each included company, ordered from most recent to least recent

### Requirement: Experience Detail Display
The Professional Experience section SHALL display, for the selected company, the role, the period of engagement, the responsibilities, and the technologies used, when that information is present in the reference resume document; a description SHALL be displayed when the resume provides one for that company.

#### Scenario: Visitor selects a company
- **WHEN** a visitor selects a company from the navigation
- **THEN** the detail area displays that company's role, period, responsibilities, and technologies (and description, if the resume provides one)

#### Scenario: Resume provides no description for a company
- **WHEN** the reference resume document contains no descriptive summary for a company's role
- **THEN** the detail area omits the description without displaying a placeholder or fabricated text

### Requirement: Default Selection
The Professional Experience section SHALL display the most recent company's details by default before any visitor interaction.

#### Scenario: Visitor loads the section
- **WHEN** a visitor loads the Professional Experience section
- **THEN** the detail area already shows the most recent company's experience without requiring a selection

### Requirement: Current Experience Indicator
The Professional Experience section SHALL visually distinguish the developer's current, ongoing role from past roles.

#### Scenario: Visitor views the current role
- **WHEN** a visitor views the company that represents the developer's current, ongoing role
- **THEN** that company is visually marked as current, distinct from past roles

### Requirement: Selected Company Indicator
The Professional Experience section SHALL visually distinguish the currently selected company in the navigation from the other companies.

#### Scenario: Visitor selects a different company
- **WHEN** a visitor selects a company other than the currently selected one
- **THEN** the newly selected company is visually marked as selected and the previous selection is no longer marked

### Requirement: Responsive Experience Layout
The Professional Experience section SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** the company navigation and the detail area remain readable and usable, stacked or otherwise arranged without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** the company navigation and the detail area are laid out side by side using the available width without appearing sparse or misaligned
