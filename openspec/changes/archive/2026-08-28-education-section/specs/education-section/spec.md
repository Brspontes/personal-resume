## Purpose

The Education section gives homepage visitors a compact, card-based view of the developer's academic background — degree, institution, and period — sourced strictly from the reference resume document, ordered chronologically and separate from the professional narrative already told by Professional Experience.

## ADDED Requirements

### Requirement: Education Card Display
The Education section SHALL display each academic degree present in the reference resume document as an individual card, showing the degree/course name, the institution, and the period.

#### Scenario: Visitor views the Education section
- **WHEN** a visitor loads the Education section
- **THEN** every academic degree from the reference resume is displayed as an individual card showing the degree/course name, the institution, and the period

### Requirement: Chronological Ordering
The Education section SHALL order academic degree cards chronologically, from most recent to least recent.

#### Scenario: Visitor views multiple degrees
- **WHEN** a visitor loads the Education section and more than one academic degree is present
- **THEN** the cards are ordered starting with the most recently completed or started degree and ending with the oldest

### Requirement: Most Recent Degree Emphasis
The Education section SHALL visually distinguish the developer's most recent academic degree from the other displayed degrees.

#### Scenario: Visitor views the most recent degree
- **WHEN** a visitor views the academic degree that is the most recent in the Education section
- **THEN** that degree's card is visually distinguished from the other degree cards

#### Scenario: Visitor views an older degree
- **WHEN** a visitor views an academic degree that is not the most recent one
- **THEN** that degree's card is displayed without the most-recent visual emphasis

### Requirement: Academic Scope Only
The Education section SHALL display only academic degrees (e.g. bachelor's, MBA, postgraduate, master's, doctorate, technical degree) and SHALL NOT display certifications or short/free courses.

#### Scenario: Visitor views the Education section content
- **WHEN** a visitor loads the Education section
- **THEN** no certification or short/free course from the reference resume appears among the displayed entries

### Requirement: Responsive Education Layout
The Education section SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** education cards stack or wrap into the available width and remain readable without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** education cards make use of the available width without appearing sparse or misaligned
