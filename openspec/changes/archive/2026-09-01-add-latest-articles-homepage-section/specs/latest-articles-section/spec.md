## Purpose

The Latest Articles section gives homepage visitors a preview of the three most recently published articles directly on the homepage, so the articles capability stays discoverable without depending on opening the site navigation.

## ADDED Requirements

### Requirement: Latest Articles Preview
The homepage SHALL display a "Latest Articles" section that shows the three most recently published articles, ordered by publication date descending, sourced from the existing Sanity articles integration.

#### Scenario: Visitor loads the homepage with published articles
- **WHEN** a visitor loads the homepage and at least one published article exists
- **THEN** the Latest Articles section displays up to the three most recently published articles, most recent first

#### Scenario: Fewer than three articles are published
- **WHEN** fewer than three published articles exist
- **THEN** the Latest Articles section displays only the published articles that exist, without placeholder or fabricated entries

### Requirement: Article Card Reuse
Each article in the Latest Articles section SHALL be rendered using the existing article card presentation used on the articles listing page, so the preview is visually and behaviorally consistent with the rest of the articles capability.

#### Scenario: Visitor views an article in the Latest Articles section
- **WHEN** a visitor views an article entry in the Latest Articles section
- **THEN** the entry shows the same article summary information (title, publication date, and available cover image) as the corresponding card on the articles listing page

### Requirement: Article Navigation from Homepage
Each article shown in the Latest Articles section SHALL link to that article's existing detail page.

#### Scenario: Visitor clicks an article in the Latest Articles section
- **WHEN** a visitor clicks or activates an article entry in the Latest Articles section
- **THEN** the visitor is navigated to that article's detail page at its existing route

### Requirement: View All Articles CTA
The Latest Articles section SHALL provide a clearly labeled call-to-action that navigates to the existing articles listing page.

#### Scenario: Visitor wants to see all articles
- **WHEN** a visitor activates the "view all articles" call-to-action in the Latest Articles section
- **THEN** the visitor is navigated to the articles listing page

### Requirement: Section Placement
The Latest Articles section SHALL render on the homepage before the Contact section.

#### Scenario: Visitor scrolls through the homepage
- **WHEN** a visitor scrolls down the homepage past the earlier sections
- **THEN** the Latest Articles section appears before the Contact section

### Requirement: Mobile Discoverability Without Navigation Menu
The Latest Articles section SHALL be visible as part of the normal homepage content flow on mobile viewports, without requiring the visitor to open the site navigation menu.

#### Scenario: Visitor browses the homepage on a mobile viewport
- **WHEN** a visitor scrolls the homepage on a mobile-width viewport without opening the navigation menu
- **THEN** the visitor encounters the Latest Articles section and can navigate to an article or the articles listing from it

### Requirement: Responsive Layout
The Latest Articles section SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** the article entries stack in a readable single-column layout without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** the article entries are laid out across the available width without appearing sparse or misaligned

### Requirement: No Published Articles
If no published articles exist, the homepage SHALL either omit the Latest Articles section or display a clear empty state, and SHALL NOT display placeholder or fabricated article content.

#### Scenario: No articles are published yet
- **WHEN** a visitor loads the homepage and no published articles exist
- **THEN** the homepage does not display the Latest Articles section, or displays it with a clear empty state, and no placeholder article content is shown

### Requirement: Resilience to Retrieval Failure
If retrieving the latest articles from Sanity fails, the homepage SHALL still render the rest of its content, and SHALL NOT display a raw error to the visitor.

#### Scenario: The latest articles request fails
- **WHEN** the homepage loads and the request for the latest articles fails
- **THEN** the rest of the homepage renders normally and no raw API or Sanity error is shown to the visitor
