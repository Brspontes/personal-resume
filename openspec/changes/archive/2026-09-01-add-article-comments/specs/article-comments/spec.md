## Purpose

The article comments capability lets visitors read and, once authenticated through the existing LinkedIn session, participate in a discussion under an individual article — posting comments, replying to them, and managing their own contributions — with the backend as the sole source of truth for content and ownership.

## ADDED Requirements

### Requirement: Comments Section on the Article Page
The individual article detail page SHALL provide a clearly identifiable comments section listing the article's comments and their replies.

#### Scenario: Visitor opens an article
- **WHEN** a visitor opens an article's detail page
- **THEN** a comments section is visible, showing the article's existing comments (if any)

### Requirement: Comments Are Backend-Sourced
The frontend SHALL retrieve comment content, authorship, timestamps, replies, and ownership state from the backend, and SHALL NOT fabricate or locally derive any of these values.

#### Scenario: Comments section loads
- **WHEN** the comments section loads for an article
- **THEN** every displayed comment and reply (content, author, dates, ownership) reflects the backend's most recently returned data for that article

### Requirement: Reading Requires No Authentication
Unauthenticated visitors SHALL be able to view an article's comments, replies, and author information.

#### Scenario: Unauthenticated visitor views comments
- **WHEN** an unauthenticated visitor opens an article's detail page
- **THEN** the visitor can read all existing comments and replies, including author names and avatars

### Requirement: One Level of Reply Nesting
The frontend SHALL support replies to top-level comments, and SHALL NOT allow replying to a reply.

#### Scenario: Visitor views a top-level comment
- **WHEN** a visitor views a top-level comment
- **THEN** a reply action is available for that comment

#### Scenario: Visitor views a reply
- **WHEN** a visitor views a reply to a comment
- **THEN** no reply action is available on that reply

### Requirement: Authentication Required to Comment
Creating a comment or reply, and editing or deleting an existing one, SHALL require the visitor to be authenticated through the existing LinkedIn session.

#### Scenario: Unauthenticated visitor attempts to comment
- **WHEN** an unauthenticated visitor tries to post a comment or reply
- **THEN** the frontend shows that LinkedIn sign-in is required and directs the visitor through the existing LinkedIn authentication flow instead of submitting the comment, and no comment request is sent to the backend

### Requirement: Create a Top-Level Comment
An authenticated visitor SHALL be able to post a new top-level comment on the article, and the comments list SHALL reflect it once the backend confirms creation.

#### Scenario: Authenticated visitor posts a comment
- **WHEN** an authenticated visitor submits non-empty comment content
- **THEN** the frontend requests that the backend create the comment, and once confirmed, the new comment appears in the comments section

#### Scenario: Visitor submits empty content
- **WHEN** a visitor attempts to submit a comment or reply with empty or whitespace-only content
- **THEN** the frontend does not submit the request

### Requirement: Reply to a Comment
An authenticated visitor SHALL be able to reply to a top-level comment, and the reply SHALL appear nested under that comment once confirmed.

#### Scenario: Authenticated visitor replies to a comment
- **WHEN** an authenticated visitor submits non-empty reply content for a top-level comment
- **THEN** the frontend requests that the backend create the reply associated with that comment, and once confirmed, the reply appears nested under it

### Requirement: Edit Own Comment or Reply
A user SHALL be able to edit a comment or reply the backend indicates they own, and SHALL NOT be offered an edit action on one they do not own.

#### Scenario: Owner edits their comment
- **WHEN** a user views a comment or reply the backend marks as their own
- **THEN** an edit action is available, and submitting a change requests that the backend update it, reflecting the update once confirmed

#### Scenario: Visitor views another user's comment
- **WHEN** a user views a comment or reply the backend does not mark as their own
- **THEN** no edit action is shown for it

### Requirement: Delete Own Comment or Reply
A user SHALL be able to delete a comment or reply the backend indicates they own, and SHALL NOT be offered a delete action on one they do not own. The frontend SHALL request confirmation before deleting.

#### Scenario: Owner deletes their comment
- **WHEN** a user with an owned comment or reply confirms deletion
- **THEN** the frontend requests that the backend delete it, and the UI reflects the deletion only once the backend confirms success

#### Scenario: Visitor views another user's comment
- **WHEN** a user views a comment or reply the backend does not mark as their own
- **THEN** no delete action is shown for it

### Requirement: Deleted Comment Visibility
A deleted top-level comment SHALL remain visible as a removed placeholder only while it still has at least one reply that is itself displayed, so that reply keeps its thread context. A deleted top-level comment with no such visible reply, and a deleted reply (which by definition has none), SHALL NOT be displayed at all.

#### Scenario: A deleted top-level comment still has a visible reply
- **WHEN** a top-level comment is deleted and it has at least one reply that is not itself deleted
- **THEN** the comment is shown as a removed placeholder, and that reply remains visible beneath it

#### Scenario: A deleted top-level comment has no replies
- **WHEN** a top-level comment is deleted and it has no replies
- **THEN** the comment is not displayed at all

#### Scenario: A deleted top-level comment's replies are all also deleted
- **WHEN** a top-level comment is deleted and every one of its replies is also deleted
- **THEN** the comment is not displayed at all, since there is no visible reply left to preserve context for

#### Scenario: A reply is deleted
- **WHEN** a reply to a comment is deleted
- **THEN** the reply is not displayed at all, with no removed placeholder shown in its place

### Requirement: Ownership Is Not a Security Mechanism
The frontend SHALL use the backend-provided ownership flag only to decide which actions to display, and SHALL rely on the backend to independently enforce ownership when a mutation is processed.

#### Scenario: A mutation is rejected as unauthorized
- **WHEN** an edit or delete request is rejected because the backend determines the visitor does not own the comment
- **THEN** the frontend does not apply the change locally and reconciles its displayed state with the backend

### Requirement: Mutation Loading and Duplicate Prevention
While a comment mutation (create, edit, or delete) is in progress, the frontend SHALL provide visible feedback and SHALL prevent a duplicate submission of the same action before it resolves.

#### Scenario: Visitor submits a comment
- **WHEN** a visitor submits a comment, reply, edit, or delete confirmation and the request has not yet completed
- **THEN** the relevant control shows a busy state and repeated submission does not send an additional concurrent request for the same action

### Requirement: Graceful Error Handling
The frontend SHALL NOT display raw backend or network error details to the visitor when a comment operation fails.

#### Scenario: A comment operation fails
- **WHEN** retrieving, creating, editing, or deleting a comment fails for any reason (authentication failure, validation failure, network failure, or unexpected backend error)
- **THEN** the visitor sees a clear, generic message rather than a raw error, and the rest of the article page remains usable

### Requirement: Empty State
If an article has no comments, the comments section SHALL display a clear empty state instead of an empty or broken layout.

#### Scenario: Article has no comments yet
- **WHEN** a visitor opens an article with no existing comments
- **THEN** the comments section shows a message indicating there are no comments yet, instead of appearing empty or broken

### Requirement: Accessible Comments Interface
Comment and reply actions SHALL be operable via keyboard, SHALL have accessible names, and the interface SHALL NOT rely exclusively on color to communicate ownership or state.

#### Scenario: Visitor navigates the comments section by keyboard
- **WHEN** a visitor tabs through the comments section and activates a control with the keyboard
- **THEN** the same behavior occurs as with a pointer click, and every interactive control has an accessible name

### Requirement: Responsive Comments Layout
The comments section, including nested replies and forms, SHALL remain usable on desktop, tablet, and mobile viewports.

#### Scenario: Visitor reads and writes comments on a mobile viewport
- **WHEN** a visitor opens an article's comments section on a mobile-width viewport
- **THEN** comment content, reply indentation, and forms remain readable and usable without horizontal scrolling
