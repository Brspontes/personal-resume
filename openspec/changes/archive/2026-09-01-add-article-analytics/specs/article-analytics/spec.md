## Purpose

The article analytics capability measures how visitors consume published articles — views, reading progress, and active reading time — for every visitor regardless of authentication, without affecting article rendering or requiring any visitor action.

## ADDED Requirements

### Requirement: Anonymous Analytics Session
The frontend SHALL generate an anonymous analytics session identifier, stable across the visitor's browsing, that contains no personally identifiable information and is never derived from the visitor's LinkedIn identity.

#### Scenario: Visitor has no existing analytics session
- **WHEN** a visitor without an existing analytics session identifier opens an article
- **THEN** the frontend generates a new opaque session identifier and reuses it for subsequent analytics events

#### Scenario: Visitor already has an analytics session
- **WHEN** a visitor with an existing analytics session identifier opens another article
- **THEN** the frontend reuses the existing identifier rather than generating a new one

### Requirement: Analytics Independent of Authentication
Analytics tracking SHALL function identically for authenticated and unauthenticated visitors, and SHALL NOT require or trigger LinkedIn authentication.

#### Scenario: Unauthenticated visitor reads an article
- **WHEN** an unauthenticated visitor reads an article
- **THEN** analytics events are sent the same way as for an authenticated visitor, and the visitor is never redirected to LinkedIn login as a result

### Requirement: Article View Tracking
Once an article has successfully loaded and is available to the visitor, the frontend SHALL send an `ARTICLE_VIEW` event identifying the article and the analytics session.

#### Scenario: Article loads successfully
- **WHEN** an article's detail page finishes loading for the visitor
- **THEN** the frontend sends an `ARTICLE_VIEW` event for that article and the current analytics session

#### Scenario: Article fails to load
- **WHEN** a visitor requests an article that does not exist or fails to load
- **THEN** the frontend does not send an `ARTICLE_VIEW` event

### Requirement: Reading Progress Milestones
The frontend SHALL track the visitor's reading progress through the article content and send an `ARTICLE_PROGRESS` event at the 25%, 50%, 75%, and 90% milestones, each at most once per reading session.

#### Scenario: Visitor scrolls past a milestone
- **WHEN** a visitor reading an article scrolls past one of the 25/50/75/90% milestones for the first time in that reading session
- **THEN** the frontend sends an `ARTICLE_PROGRESS` event for that milestone

#### Scenario: Visitor scrolls back and forth across a milestone
- **WHEN** a visitor scrolls past an already-reached milestone again (e.g. scrolling up and back down)
- **THEN** the frontend does not send a duplicate `ARTICLE_PROGRESS` event for that milestone

### Requirement: Active Reading Time Tracking
The frontend SHALL measure active reading time starting when the article becomes available, excluding time while the browser tab is not visible.

#### Scenario: Visitor reads with the tab visible
- **WHEN** a visitor reads an article with the browser tab visible
- **THEN** elapsed time counts toward the article's active reading duration

#### Scenario: Visitor switches away from the tab
- **WHEN** a visitor switches to a different browser tab or minimizes the browser while reading
- **THEN** time spent away does not count toward the article's active reading duration

### Requirement: Article Read Completion Event
When the visitor leaves the article (navigates away, closes the tab, or moves to a different article), the frontend SHALL send an `ARTICLE_READ` event containing the total active reading duration and the maximum reading progress percentage observed, and SHALL attempt delivery even as the page is unloading.

#### Scenario: Visitor navigates away from an article
- **WHEN** a visitor who has been reading an article leaves it
- **THEN** the frontend sends an `ARTICLE_READ` event with the accumulated active reading duration and the highest progress percentage reached during that reading session

### Requirement: Tracking State Resets Between Articles
When the visitor navigates from one article directly to another without a full page reload, the frontend SHALL send the completion event for the article being left and SHALL start fresh progress and timing state for the newly opened article.

#### Scenario: Visitor navigates from one article to another
- **WHEN** a visitor moves from Article A directly to Article B
- **THEN** Article A's `ARTICLE_READ` event reflects only Article A's reading session, and Article B's tracking starts with no progress or elapsed time carried over from Article A

### Requirement: Analytics Failures Do Not Affect the Visitor
Analytics requests SHALL NOT block or delay article rendering, and a failed analytics request SHALL NOT be surfaced to the visitor as an error.

#### Scenario: The analytics backend is unavailable
- **WHEN** an analytics event fails to send for any reason (network failure, backend error, or rate limiting)
- **THEN** the article continues to render and function normally, and the visitor sees no error related to the failed analytics event

### Requirement: No Excessive Analytics Traffic
The frontend SHALL NOT retry failed analytics events aggressively, and SHALL NOT generate more than one request per tracked event (one view, one request per distinct progress milestone, one read-completion request per reading session).

#### Scenario: An analytics event fails
- **WHEN** an analytics event fails to send
- **THEN** the frontend does not aggressively retry that event
