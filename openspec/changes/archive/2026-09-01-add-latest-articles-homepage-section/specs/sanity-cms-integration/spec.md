## MODIFIED Requirements

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
