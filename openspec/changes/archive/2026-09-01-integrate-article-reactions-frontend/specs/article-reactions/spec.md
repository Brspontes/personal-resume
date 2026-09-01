## Purpose

The article reactions capability lets visitors like or dislike an individual article from the article detail page, backed entirely by the existing reactions backend, so the frontend never becomes a second source of truth for reaction state or rules.

## ADDED Requirements

### Requirement: Reaction Section on the Article Page
The individual article detail page SHALL provide a clearly identifiable reaction area offering Like and Dislike controls.

#### Scenario: Visitor opens an article
- **WHEN** a visitor opens an article's detail page
- **THEN** a reaction section with Like and Dislike controls is visible on the page

### Requirement: Reactions Are Backend-Sourced
The frontend SHALL retrieve reaction counts and the visitor's own current reaction from the backend, and SHALL NOT calculate or infer either value locally.

#### Scenario: Article page loads
- **WHEN** the article detail page loads
- **THEN** the displayed like/dislike counts and the visitor's current reaction (if any) are the values most recently returned by the backend for that article

### Requirement: Only the Backend's Reaction Types Are Supported
The frontend SHALL support only the reaction types defined by the backend (Like and Dislike) and SHALL NOT introduce additional reaction types.

#### Scenario: Visitor views the reaction controls
- **WHEN** a visitor views the reaction section
- **THEN** only a Like control and a Dislike control are offered

### Requirement: Authentication Required to React
Creating, changing, or removing a reaction SHALL require the visitor to be authenticated through the existing LinkedIn session. Viewing an article and its reaction counts SHALL NOT require authentication.

#### Scenario: Unauthenticated visitor views an article
- **WHEN** an unauthenticated visitor opens an article's detail page
- **THEN** the visitor can view the article and the current reaction counts

#### Scenario: Unauthenticated visitor attempts to react
- **WHEN** an unauthenticated visitor selects Like or Dislike
- **THEN** the frontend directs the visitor through the existing LinkedIn authentication flow instead of creating a reaction, and no reaction request is sent to the backend

### Requirement: Upfront Notice Before Redirecting to Login
While the visitor is known to be unauthenticated, the reaction section SHALL display a visible notice explaining that reacting requires LinkedIn authentication and that activating a reaction control will redirect them, so the redirect is expected rather than a surprise.

#### Scenario: Unauthenticated visitor views the reaction section
- **WHEN** an unauthenticated visitor views the reaction section on an article's detail page
- **THEN** a visible notice near the reaction controls states that authentication is required and that clicking will redirect to login

#### Scenario: Authenticated visitor views the reaction section
- **WHEN** an authenticated visitor views the reaction section
- **THEN** the login notice is not shown

### Requirement: Create a Reaction
When an authenticated visitor selects a reaction they do not currently have, the frontend SHALL request that the backend record it, and SHALL update the displayed state to match the backend's response.

#### Scenario: Authenticated visitor with no existing reaction selects Like
- **WHEN** an authenticated visitor with no existing reaction on the article selects Like
- **THEN** the frontend requests the backend to record a Like, and the Like control reflects the backend-confirmed selection

### Requirement: Change a Reaction
When an authenticated visitor selects the opposite of their current reaction, the frontend SHALL request the change and SHALL never present both Like and Dislike as simultaneously active.

#### Scenario: Authenticated visitor with an active Like selects Dislike
- **WHEN** an authenticated visitor whose current reaction is Like selects Dislike
- **THEN** the frontend requests the backend to change the reaction, and afterward only Dislike is shown as active

### Requirement: Remove a Reaction
When an authenticated visitor selects their currently active reaction again, the frontend SHALL request that the backend remove it, returning the article to a no-reaction state for that visitor.

#### Scenario: Authenticated visitor with an active Like selects Like again
- **WHEN** an authenticated visitor whose current reaction is Like selects Like again
- **THEN** the frontend requests removal of the reaction, and afterward neither Like nor Dislike is shown as active for that visitor

### Requirement: Reaction Mutation Loading State
While a reaction request is in progress, the frontend SHALL provide visible feedback and SHALL prevent a duplicate request for the same action from being sent before the first one resolves.

#### Scenario: Visitor selects a reaction
- **WHEN** an authenticated visitor selects a reaction and the request has not yet completed
- **THEN** the reaction control shows a busy/processing state and repeated activation does not send additional concurrent requests for the same action

### Requirement: Reconciliation on Failure
If a reaction request fails, the frontend SHALL revert the reaction UI to the last backend-confirmed state rather than leaving an unconfirmed change displayed.

#### Scenario: A reaction request fails
- **WHEN** a visitor selects a reaction and the backend request fails
- **THEN** the reaction section reverts to the visitor's last known backend-confirmed reaction state

### Requirement: Graceful Error Handling
The frontend SHALL NOT display raw backend or network error details to the visitor when a reaction request fails, including authentication failures, validation failures, and network failures.

#### Scenario: A reaction request fails for any reason
- **WHEN** a reaction request fails, whether due to an expired session, a validation error, a network failure, or an unexpected backend error
- **THEN** the visitor sees a clear, generic message rather than a raw error, and the rest of the article page remains usable

### Requirement: Accessible Reaction Controls
Each reaction control SHALL be operable via keyboard, SHALL have an accessible name describing its action (e.g. distinguishing "Like" from "Remove like"), and SHALL communicate the selected state without relying on color alone.

#### Scenario: Visitor navigates the reaction controls by keyboard
- **WHEN** a visitor tabs to a reaction control and activates it with the keyboard
- **THEN** the same reaction behavior occurs as with a pointer click, and the control's accessible name reflects its current action

#### Scenario: Visitor has an active reaction
- **WHEN** a visitor has an active Like or Dislike
- **THEN** the active state is communicated through more than color alone (e.g. an accessible label or icon change), so it remains perceivable without relying on color

### Requirement: Responsive Reaction Controls
The reaction controls SHALL remain usable and easy to activate on desktop, tablet, and mobile viewports.

#### Scenario: Visitor reacts from a mobile viewport
- **WHEN** a visitor opens an article on a mobile-width viewport
- **THEN** the Like and Dislike controls are easy to tap and remain fully usable
