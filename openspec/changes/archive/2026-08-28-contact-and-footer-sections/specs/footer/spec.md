## Purpose

The Footer closes the homepage with a minimal, consistent summary of the developer's identity and contact channels, plus an always-current copyright line, without visually competing with the Contact section above it.

## ADDED Requirements

### Requirement: Footer Identity Display
The Footer SHALL display the developer's name and current role/professional title.

#### Scenario: Visitor scrolls to the Footer
- **WHEN** a visitor reaches the Footer at the bottom of the homepage
- **THEN** the developer's name and current role are displayed

### Requirement: Footer Contact Links
The Footer SHALL display the same real contact links available in the Contact section.

#### Scenario: Visitor views the Footer
- **WHEN** a visitor loads the Footer
- **THEN** the Footer displays clickable links to the same real contact channels shown in the Contact section, with no fabricated channel added

### Requirement: Current-Year Copyright
The Footer SHALL display a copyright line whose year always matches the current year at page render time.

#### Scenario: Visitor views the Footer in any year
- **WHEN** a visitor loads the homepage
- **THEN** the Footer's copyright line shows the current calendar year, without requiring a manual code update to stay correct

### Requirement: Minimal Footer Presentation
The Footer SHALL use a visually minimal presentation that does not compete with the Contact section's call-to-action.

#### Scenario: Visitor views the Contact section followed by the Footer
- **WHEN** a visitor scrolls from the Contact section into the Footer
- **THEN** the Footer is visually subdued relative to the Contact section's call-to-action, not repeating it with equal emphasis

### Requirement: Responsive Footer Layout
The Footer SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths without horizontal overflow.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** the Footer's content stacks or wraps into the available width and remains readable without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** the Footer's content makes use of the available width without appearing sparse or misaligned
