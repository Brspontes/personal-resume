## Why

The backend now supports Like/Dislike reactions on comments and replies, but the frontend has no way to surface or use them. Visitors can already react to an article and can already comment, but cannot react to an individual comment or reply, leaving an inconsistency between what the backend offers and what the UI exposes.

## What Changes

- Add Like/Dislike controls to each comment and reply, rendered by a single reusable reaction component shared between comments and replies (no separate `CommentLike`/`ReplyLike` components).
- Add like count, dislike count, and the current user's reaction state to the comment/reply data model, sourced entirely from the backend.
- Add an API service for comment/reply reactions (`addOrUpdateReaction`, `removeReaction`), following the existing `src/lib/reactions/service.ts` pattern, targeting `POST /comments/:commentId/reactions` and `DELETE /comments/:commentId/reactions`.
- Add a dedicated React Query hook (`useCommentReaction`) that encapsulates the mutation, loading state, cache updates, and error handling, mirroring the existing `useArticleReactions` hook.
- Reuse the existing unauthenticated-visitor-redirects-to-LinkedIn-login pattern already used by article reactions and comments; no new authentication mechanism is introduced.
- Reuse the existing inline `role="alert"` error-display convention; no toast system is introduced.
- Add tests for the new component and hook following existing Vitest/Testing Library conventions.

## Capabilities

### New Capabilities
- `comment-reactions`: Lets an authenticated visitor like, dislike, switch, or remove their reaction on a comment or reply, with counts and current-reaction state sourced entirely from the backend, reusing the same reusable control for both comments and replies.

### Modified Capabilities
None. Mirroring how `article-reactions` is kept separate from `article-comments`, comment/reply reactions are specified entirely under the new `comment-reactions` capability. No existing `article-comments` requirement (creation, editing, deletion, nesting, ownership) changes; the `Comment` data shape gaining reaction fields and rendering reaction controls is additive behavior owned by the new capability.

## Impact

- Affected code: `src/lib/comments/types.ts` (extend `Comment` with reaction fields), `src/lib/comments/service.ts` (add reaction endpoints), `src/hooks/useCommentReaction.ts` (new hook), `src/components/CommentItem.tsx` (render the reusable reaction control), a new reusable `CommentReaction` component under `src/components/`.
- Possibly extracted: a shared reaction-type/model from `src/lib/reactions/types.ts` if it can be reused as-is for comment reactions without duplicating the `ReactionType` union.
- No backend, database, authentication, or article-reaction behavior changes.
- New tests under `src/__tests__/components/` and `src/__tests__/hooks/` for the new component and hook.
