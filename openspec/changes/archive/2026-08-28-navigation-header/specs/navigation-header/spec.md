## Purpose

The navigation header lets a homepage visitor jump directly to any major section from a persistent, always-reachable header, instead of manually scrolling through the entire page, with a responsive layout for both desktop and mobile.

## ADDED Requirements

### Requirement: Persistent Header Visibility
The navigation header SHALL remain visible and reachable at the top of the viewport while the visitor scrolls the homepage.

#### Scenario: Visitor scrolls the homepage
- **WHEN** a visitor scrolls down the homepage past the Hero section
- **THEN** the navigation header remains visible at the top of the viewport

### Requirement: Section Navigation Links
The navigation header SHALL provide a link to every major homepage section: Home, Professional Highlights, Professional Experience, Skills, Education, Certifications, and Contact.

#### Scenario: Visitor views the navigation header
- **WHEN** a visitor views the navigation header
- **THEN** a link is present for each of the seven major sections

### Requirement: Anchor Navigation
Activating a navigation link SHALL move the visitor to the top of the corresponding section without that section's top content being hidden underneath the header.

#### Scenario: Visitor activates a navigation link
- **WHEN** a visitor clicks or activates a navigation link
- **THEN** the corresponding section scrolls into view with its top content fully visible below the header, not obscured by it

#### Scenario: Visitor activates a navigation link with reduced-motion preference
- **WHEN** a visitor who has requested reduced motion at the operating-system level activates a navigation link
- **THEN** the visitor still reaches the corresponding section without an abrupt, disorienting jump forced against their preference

### Requirement: Link Interaction States
Every navigation link, and the mobile menu toggle control, SHALL provide a visibly distinct hover state and a visibly distinct keyboard-focus state.

#### Scenario: Visitor hovers over a navigation link
- **WHEN** a visitor points at a navigation link
- **THEN** the link's appearance visibly changes to indicate it is interactive

#### Scenario: Visitor navigates to a link via keyboard
- **WHEN** a visitor moves keyboard focus to a navigation link or the mobile menu toggle
- **THEN** its appearance visibly changes to indicate it is focused

### Requirement: Mobile Navigation Toggle
On a mobile-width viewport, the navigation header SHALL collapse its links behind a compact, keyboard- and screen-reader-accessible toggle control that opens and closes the link list.

#### Scenario: Visitor on a mobile viewport opens the menu
- **WHEN** a visitor on a mobile-width viewport activates the navigation toggle
- **THEN** the list of section links becomes visible and reachable

#### Scenario: Visitor on a mobile viewport closes the menu
- **WHEN** a visitor on a mobile-width viewport activates the navigation toggle again while the menu is open
- **THEN** the list of section links is hidden again

#### Scenario: Assistive technology user encounters the mobile toggle
- **WHEN** a visitor using a screen reader reaches the mobile navigation toggle
- **THEN** the control's accessible name and expanded/collapsed state are announced

### Requirement: Header Keyboard Accessibility
Every interactive element in the navigation header SHALL be reachable and operable using only the keyboard.

#### Scenario: Visitor navigates the header via keyboard
- **WHEN** a visitor uses the keyboard to move through the navigation header
- **THEN** every link and the mobile toggle can be reached and activated without a mouse

### Requirement: Responsive Header Layout
The navigation header SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths without horizontal overflow, and SHALL NOT visually overwhelm the Hero section beneath it.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** the header shows the logo/name and the compact navigation toggle, without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** the header shows the logo/name and every section link in a single row, remaining visually discreet relative to the Hero section
