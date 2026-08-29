## Purpose

The articles capability gives portfolio visitors a dedicated place to read published technical articles and content, presented as a natural extension of the existing portfolio.

## ADDED Requirements

### Requirement: Article Listing Page
The system SHALL provide an articles listing page at `/articles` that displays every published article ordered by publication date, most recent first.

#### Scenario: Visitor opens the articles listing page
- **WHEN** a visitor navigates to `/articles`
- **THEN** the page displays the published articles ordered from most recent to oldest publication date

#### Scenario: No articles are published yet
- **WHEN** a visitor navigates to `/articles` and no published articles exist
- **THEN** the page displays a clear empty state instead of an empty or broken layout

### Requirement: Article Card Metadata
Each article card on the listing page SHALL display the article's cover image (when present), title, description, category, publication date, and estimated reading time, and SHALL display tags when the article has tags.

#### Scenario: Visitor views an article card
- **WHEN** a visitor views an article card on the listing page
- **THEN** the card shows the article's title, description, category, publication date, and estimated reading time

#### Scenario: Article has no cover image
- **WHEN** an article without a cover image is displayed as a card
- **THEN** the card renders without a broken image and without a missing-image layout gap

### Requirement: Featured Article Distinction
The article listing page SHALL visually distinguish articles marked as featured from non-featured articles.

#### Scenario: Listing page includes a featured article
- **WHEN** the articles listing page renders and at least one published article is marked featured
- **THEN** the featured article is visually distinguished from non-featured articles on the page

### Requirement: Article Detail Page
The system SHALL provide an article detail page at `/articles/[slug]` that renders a single published article's title, publication date, category, estimated reading time, cover image (when present), rich body content, and tags.

#### Scenario: Visitor opens a published article
- **WHEN** a visitor navigates to `/articles/[slug]` for a published article's slug
- **THEN** the page displays that article's title, publication date, category, estimated reading time, body content, and tags

#### Scenario: Visitor navigates back to the listing
- **WHEN** a visitor is on an article detail page
- **THEN** a navigation control is available that returns the visitor to the articles listing page

### Requirement: Not-Found Handling for Articles
The system SHALL return a not-found response for any article slug that does not exist or is not published.

#### Scenario: Visitor requests a nonexistent slug
- **WHEN** a visitor navigates to `/articles/[slug]` for a slug with no matching article
- **THEN** the system returns an appropriate not-found response

#### Scenario: Visitor requests an unpublished article's slug
- **WHEN** a visitor navigates to `/articles/[slug]` for an article that exists but is not published
- **THEN** the system returns an appropriate not-found response instead of rendering the draft content

### Requirement: Rich Content Rendering
The article detail page SHALL render the article's rich text body, including headings, paragraphs, bold and italic text, links, ordered and unordered lists, block quotes, code blocks, and images, through a reusable content renderer.

#### Scenario: Article body contains multiple content types
- **WHEN** a published article's body includes headings, lists, a block quote, a code block, and an image
- **THEN** the detail page renders each of these content types in their corresponding visual form

#### Scenario: Article body contains an unsupported content type
- **WHEN** a published article's body includes a content block type the renderer does not explicitly support
- **THEN** the page still renders the rest of the article's content without failing to load

### Requirement: Article Page SEO Metadata
Each article detail page SHALL expose SEO metadata derived from the article's content, including page title, description, canonical URL, and Open Graph metadata, with a social sharing image when the article has a cover image.

#### Scenario: Article page metadata is requested
- **WHEN** a published article page is loaded or crawled
- **THEN** the page's title, description, canonical URL, and Open Graph tags reflect that article's content

### Requirement: Article Listing Page SEO Metadata
The articles listing page SHALL expose page-level SEO metadata, including a page title and description.

#### Scenario: Listing page metadata is requested
- **WHEN** the articles listing page is loaded or crawled
- **THEN** the page exposes a title and description identifying it as the site's articles section
