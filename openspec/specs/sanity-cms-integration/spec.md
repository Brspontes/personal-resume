# sanity-cms-integration Specification

## Purpose

The Sanity CMS integration capability makes an external headless CMS the source of truth for article content, so content can be authored, published, and updated without changing or redeploying the frontend source code.

## Requirements

### Requirement: External Content Source of Truth
The system SHALL treat Sanity as the source of truth for article content. Article content SHALL NOT be stored as static data in the frontend source code.

#### Scenario: Article content is added or edited
- **WHEN** an article is created or edited in Sanity and published
- **THEN** the change is reflected on the portfolio without any modification to the frontend source code

### Requirement: Published-Only Public Visibility
The system SHALL expose only published article content through the public site. Draft or unpublished content SHALL NOT be rendered through public routes.

#### Scenario: Visitor browses public routes
- **WHEN** a regular visitor requests the articles listing page or an article detail page
- **THEN** only published articles are retrievable and displayed, never drafts or unpublished content

### Requirement: Article Content Model
The system SHALL define an article content type in Sanity that supports title, slug, description/excerpt, cover image, publication date, category, tags, estimated reading time, a featured flag, rich text body, and author information.

#### Scenario: Author creates an article in Sanity
- **WHEN** a content author fills in title, slug, excerpt, cover image, publication date, category, tags, reading time, featured flag, body, and author fields for a new article
- **THEN** the article can be saved and, once published, all provided fields are retrievable by the frontend

### Requirement: Extensible Content Model
The article content model SHALL be structured so that additional content types can be introduced later without requiring changes to how existing article queries or rendering behave.

#### Scenario: A new content type is introduced later
- **WHEN** a new Sanity content type unrelated to articles is added to the schema
- **THEN** existing article retrieval and rendering continue to function without modification

### Requirement: Centralized Content Retrieval
The system SHALL provide dedicated content retrieval operations for: published articles, the N most recently published articles, featured articles, a single article by slug, article categories, and article tags.

#### Scenario: Frontend requests published articles
- **WHEN** the articles listing page loads
- **THEN** the system retrieves the set of published articles ordered by publication date

#### Scenario: Frontend requests the latest articles
- **WHEN** the homepage's Latest Articles section loads
- **THEN** the system retrieves only the N most recently published articles, ordered by publication date descending

#### Scenario: Frontend requests a single article
- **WHEN** an article detail page loads for a given slug
- **THEN** the system retrieves the single published article matching that slug, or none if no published article matches

### Requirement: Credential Confidentiality
Sensitive Sanity credentials SHALL be stored using environment variables and SHALL NOT be exposed to the browser. Only the minimum public, read-only configuration (such as project ID and dataset name) required for public content retrieval SHALL be accessible client-side.

#### Scenario: Application is built or deployed
- **WHEN** the application is built and served to a visitor
- **THEN** no private Sanity API tokens or write credentials are present in client-delivered code or responses

### Requirement: Content Revalidation
The system SHALL refresh displayed article content from Sanity on a bounded schedule or via revalidation, so that newly published or edited content becomes visible on the portfolio without a manual frontend code change or redeploy.

#### Scenario: An article is published after the site was last built
- **WHEN** a new article is published in Sanity after the portfolio was last deployed
- **THEN** the article becomes visible on the live portfolio within the defined revalidation window, without a new deployment
