## Purpose

The comment reactions capability lets authenticated visitors like or dislike an individual comment or reply, using the same reusable control and behavior for both, backed entirely by the existing reactions backend so the frontend never becomes a second source of truth for reaction state or rules.

## ADDED Requirements

### Requirement: Reaction Controls on Comments and Replies
Every displayed top-level comment and every displayed reply SHALL offer Like and Dislike controls, rendered by the same reusable control regardless of whether the target is a comment or a reply.

#### Scenario: Visitor views a top-level comment
- **WHEN** a visitor views a displayed top-level comment
- **THEN** Like and Dislike controls are shown for that comment

#### Scenario: Visitor views a reply
- **WHEN** a visitor views a displayed reply
- **THEN** Like and Dislike controls are shown for that reply, using the same control used for top-level comments

### Requirement: Reactions Are Backend-Sourced
The frontend SHALL retrieve each comment's and reply's like count, dislike count, and the visitor's own current reaction from the backend, and SHALL NOT calculate or infer any of these values locally.

#### Scenario: Comments section loads
- **WHEN** the comments section loads for an article
- **THEN** the displayed like/dislike counts and the visitor's current reaction (if any) for every comment and reply reflect the values most recently returned by the backend

### Requirement: Only the Backend's Reaction Types Are Supported
The frontend SHALL support only the reaction types defined by the backend (Like and Dislike) for comments and replies, and SHALL NOT introduce additional reaction types.

#### Scenario: Visitor views a comment's reaction controls
- **WHEN** a visitor views the reaction controls on a comment or reply
- **THEN** only a Like control and a Dislike control are offered

### Requirement: Authentication Required to React
Creating, changing, or removing a reaction on a comment or reply SHALL require the visitor to be authenticated through the existing LinkedIn session. Viewing a comment's or reply's reaction counts SHALL NOT require authentication.

#### Scenario: Unauthenticated visitor views comments
- **WHEN** an unauthenticated visitor opens an article's detail page
- **THEN** the visitor can view every comment's and reply's reaction counts

#### Scenario: Unauthenticated visitor attempts to react to a comment
- **WHEN** an unauthenticated visitor selects Like or Dislike on a comment or reply
- **THEN** the frontend directs the visitor through the existing LinkedIn authentication flow instead of creating a reaction, and no reaction request is sent to the backend

### Requirement: Reactions Available on Own Comments and Replies
The reaction controls SHALL be shown and usable on the visitor's own comments and replies, independently of any comment-ownership rule that governs editing or deleting.

#### Scenario: Owner views their own comment
- **WHEN** a visitor views a comment or reply the backend marks as their own
- **THEN** Like and Dislike controls are shown and usable for it, regardless of whether edit or delete actions are also shown

### Requirement: Create a Reaction on a Comment or Reply
When an authenticated visitor selects a reaction they do not currently have on a comment or reply, the frontend SHALL request that the backend record it, and SHALL update the displayed state to match the backend's response.

#### Scenario: Authenticated visitor with no existing reaction selects Like
- **WHEN** an authenticated visitor with no existing reaction on a comment or reply selects Like
- **THEN** the frontend requests the backend to record a Like, and the Like control reflects the backend-confirmed selection

### Requirement: Change a Reaction on a Comment or Reply
When an authenticated visitor selects the opposite of their current reaction on a comment or reply, the frontend SHALL request the change and SHALL never present both Like and Dislike as simultaneously active for the same comment or reply.

#### Scenario: Authenticated visitor with an active Like selects Dislike
- **WHEN** an authenticated visitor whose current reaction on a comment or reply is Like selects Dislike
- **THEN** the frontend requests the backend to change the reaction, and afterward only Dislike is shown as active for that comment or reply

### Requirement: Remove a Reaction on a Comment or Reply
When an authenticated visitor selects their currently active reaction again on a comment or reply, the frontend SHALL request that the backend remove it, returning that comment or reply to a no-reaction state for that visitor.

#### Scenario: Authenticated visitor with an active Like selects Like again
- **WHEN** an authenticated visitor whose current reaction on a comment or reply is Like selects Like again
- **THEN** the frontend requests removal of the reaction, and afterward neither Like nor Dislike is shown as active for that visitor on that comment or reply

### Requirement: Reaction Mutation Loading State Scoped to the Target
While a reaction request for a specific comment or reply is in progress, the frontend SHALL provide visible feedback scoped to that comment's or reply's controls, SHALL prevent a duplicate request for the same action from being sent before the first one resolves, and SHALL NOT block interaction with other comments or replies.

#### Scenario: Visitor reacts to one comment while another is unaffected
- **WHEN** an authenticated visitor selects a reaction on one comment and the request has not yet completed
- **THEN** that comment's reaction controls show a busy state, repeated activation on it does not send an additional concurrent request for the same action, and other comments and replies remain fully interactive

### Requirement: Reconciliation on Failure
If a reaction request for a comment or reply fails, the frontend SHALL revert that comment's or reply's reaction UI to the last backend-confirmed state rather than leaving an unconfirmed change displayed.

#### Scenario: A reaction request fails
- **WHEN** a visitor selects a reaction on a comment or reply and the backend request fails
- **THEN** that comment's or reply's reaction controls revert to the visitor's last known backend-confirmed reaction state

### Requirement: Graceful Error Handling
The frontend SHALL NOT display raw backend or network error details to the visitor when a comment or reply reaction request fails, including authentication failures, validation failures, and network failures.

#### Scenario: A reaction request fails for any reason
- **WHEN** a comment or reply reaction request fails, whether due to an expired session, a validation error, a network failure, or an unexpected backend error
- **THEN** the visitor sees a clear, generic message rather than a raw error, and the rest of the comments section remains usable

### Requirement: Accessible Reaction Controls
Each comment or reply reaction control SHALL be operable via keyboard, SHALL have an accessible name describing its action (e.g. distinguishing "Like comment" from "Remove reaction"), and SHALL communicate the selected state without relying on color alone.

#### Scenario: Visitor navigates a comment's reaction controls by keyboard
- **WHEN** a visitor tabs to a comment's or reply's reaction control and activates it with the keyboard
- **THEN** the same reaction behavior occurs as with a pointer click, and the control's accessible name reflects its current action

#### Scenario: Visitor has an active reaction on a comment
- **WHEN** a visitor has an active Like or Dislike on a comment or reply
- **THEN** the active state is communicated through more than color alone (e.g. an accessible label or icon change)

### Requirement: Responsive Reaction Controls
Comment and reply reaction controls SHALL remain usable and easy to activate on desktop, tablet, and mobile viewports, including within nested reply indentation.

#### Scenario: Visitor reacts to a reply from a mobile viewport
- **WHEN** a visitor opens an article's comments section on a mobile-width viewport
- **THEN** the Like and Dislike controls on comments and nested replies are easy to tap and remain fully usable
