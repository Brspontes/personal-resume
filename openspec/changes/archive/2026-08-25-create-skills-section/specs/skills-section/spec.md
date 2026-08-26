## Purpose

The Skills section gives homepage visitors a compact, scannable grid of the developer's technical skills — languages, frameworks, platforms, and tools — sourced strictly from the reference resume document, separate from the narrative already told by Professional Experience.

## ADDED Requirements

### Requirement: Flat Skill Grid Display
The Skills section SHALL display every skill as a single flat grid, without grouping skills under category headings.

#### Scenario: Visitor views the Skills section
- **WHEN** a visitor loads the Skills section
- **THEN** every skill is displayed as part of one continuous grid, with no category heading separating subsets of skills

### Requirement: Skill Card Presentation
The Skills section SHALL present each skill as an individual card. A card SHALL display the skill's official logo when one is available; when no official logo is available for a skill, the card SHALL display the skill's name as text instead of a logo.

#### Scenario: Visitor views a skill with an available logo
- **WHEN** a visitor views a skill for which an official technology logo is available
- **THEN** that skill's card displays the logo

#### Scenario: Visitor views a skill without an available logo
- **WHEN** a visitor views a skill for which no official technology logo is available
- **THEN** that skill's card displays the skill's name as text instead of a logo, without a placeholder or a fabricated icon

### Requirement: Skill Name Tooltip
The Skills section SHALL display a skill's full name in a tooltip when a visitor hovers over that skill's card.

#### Scenario: Visitor hovers over a skill card
- **WHEN** a visitor points at a skill card
- **THEN** a tooltip showing that skill's full name appears

### Requirement: Skill Deduplication
The Skills section SHALL display a given skill only once, even when the reference resume lists that skill under more than one professional experience.

#### Scenario: A skill appears in multiple experiences
- **WHEN** the reference resume lists the same skill under two or more experience entries
- **THEN** the Skills section renders that skill as a single card, not once per experience

### Requirement: Primary Skill Emphasis
The Skills section SHALL visually distinguish the developer's primary/core skills from the rest of the displayed skills.

#### Scenario: Visitor views a primary skill
- **WHEN** a visitor views a skill that is one of the developer's designated primary skills
- **THEN** that skill's card is visually distinguished from non-primary skill cards

#### Scenario: Visitor views a non-primary skill
- **WHEN** a visitor views a skill that is not one of the developer's designated primary skills
- **THEN** that skill's card is displayed without the primary-skill visual emphasis

### Requirement: Responsive Skills Layout
The Skills section SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** skill cards wrap into the available width and remain readable without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** skill cards make use of the available width without appearing sparse or misaligned
