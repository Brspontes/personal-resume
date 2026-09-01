## Purpose

The LinkedIn authentication capability lets the frontend determine whether a visitor is signed in through the existing backend-managed LinkedIn session, and route them through that existing login flow when a feature requires authentication, without the frontend implementing any part of the OAuth protocol itself.

## ADDED Requirements

### Requirement: Session-Based Authentication State
The frontend SHALL determine the visitor's authentication state by querying the existing backend session endpoint, and SHALL treat the backend as the source of truth for whether the visitor is signed in.

#### Scenario: Visitor has an active backend session
- **WHEN** the frontend queries the backend for the current user and a valid session cookie is present
- **THEN** the frontend treats the visitor as authenticated and has access to their profile information returned by the backend

#### Scenario: Visitor has no active backend session
- **WHEN** the frontend queries the backend for the current user and no valid session cookie is present
- **THEN** the frontend treats the visitor as unauthenticated

### Requirement: No Second Authentication Mechanism
The frontend SHALL NOT implement LinkedIn OAuth, issue its own tokens, or otherwise duplicate authentication logic already provided by the backend.

#### Scenario: A feature needs to know if the visitor is signed in
- **WHEN** any frontend feature needs the visitor's authentication state
- **THEN** it obtains that state exclusively through the existing backend session mechanism, with no parallel authentication system

### Requirement: No Credential or Token Storage
The frontend SHALL NOT store LinkedIn credentials, LinkedIn access tokens, or session/JWT tokens in browser storage (such as `localStorage` or `sessionStorage`).

#### Scenario: A visitor completes LinkedIn login
- **WHEN** a visitor successfully signs in through LinkedIn
- **THEN** no LinkedIn credential, LinkedIn access token, or session token is written to browser-accessible storage by the frontend

### Requirement: Login Redirect Flow
When a visitor needs to authenticate, the frontend SHALL direct the browser to the existing backend LinkedIn login endpoint, and SHALL NOT render a custom login form or handle LinkedIn credentials directly.

#### Scenario: Unauthenticated visitor starts login
- **WHEN** an unauthenticated visitor is directed to authenticate
- **THEN** the browser navigates to the backend's existing LinkedIn login endpoint, and control of the LinkedIn sign-in process remains entirely with the backend and LinkedIn

#### Scenario: Visitor returns after completing login
- **WHEN** the backend completes the LinkedIn login flow
- **THEN** the visitor is returned to the page they started from, now recognized as authenticated

### Requirement: Authentication Loading State
While the frontend is resolving the visitor's authentication state, any feature that depends on it SHALL avoid presenting an incorrect authenticated or unauthenticated state.

#### Scenario: Authentication state has not yet resolved
- **WHEN** a page loads and the frontend has not yet received a response about the visitor's authentication state
- **THEN** dependent features show a neutral loading state instead of assuming the visitor is authenticated or unauthenticated

### Requirement: Session Expiration Handling
If the backend indicates that the visitor's session is no longer valid, the frontend SHALL treat the visitor as unauthenticated and SHALL NOT treat any pending action as having succeeded on their behalf.

#### Scenario: A request fails because the session has expired
- **WHEN** the backend responds to a request indicating the session is no longer valid
- **THEN** the frontend updates the visitor's authentication state to unauthenticated and does not report the attempted action as successful
