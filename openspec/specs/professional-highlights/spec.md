# professional-highlights Specification

## Purpose

The Professional Highlights section gives homepage visitors a fast, scannable summary of the developer's career scope, expressed as objective metrics sourced directly from the reference resume document, positioned immediately after the Hero.

## Requirements

### Requirement: Highlight Metrics Sourced from Resume
The Professional Highlights section SHALL display a set of value/label highlight pairs, each derived from an exact, unambiguous count or statement present in the project's reference resume document, with no estimated, inferred, or invented values.

#### Scenario: Visitor views the highlights
- **WHEN** a visitor loads the homepage
- **THEN** the Professional Highlights section displays value/label pairs whose values are traceable to the reference resume document

#### Scenario: Resume lacks sufficient data for a candidate highlight
- **WHEN** a candidate highlight cannot be backed by an exact count or statement in the reference resume document
- **THEN** that highlight is not displayed

### Requirement: Section Placement
The Professional Highlights section SHALL render on the homepage immediately after the Hero section and before any other homepage content.

#### Scenario: Visitor scrolls past the Hero
- **WHEN** a visitor scrolls down from the Hero section
- **THEN** the Professional Highlights section is the next content encountered

### Requirement: Visual Consistency with Hero
The Professional Highlights section SHALL use the same visual language established by the Hero section (typography, accent color, spacing conventions).

#### Scenario: Visitor compares sections visually
- **WHEN** a visitor views the Hero and Professional Highlights sections together
- **THEN** both sections share consistent typography, accent color usage, and spacing conventions

### Requirement: Responsive Highlights Layout
The Professional Highlights section SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** the highlight items stack in a readable single-column (or equivalent narrow) layout without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** the highlight items are laid out across the available width in a balanced grid without appearing sparse or misaligned
