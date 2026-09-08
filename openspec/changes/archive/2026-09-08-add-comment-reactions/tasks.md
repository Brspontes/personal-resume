## 1. Types

- [x] 1.1 Extend `src/lib/comments/types.ts`: import `ReactionType` from `src/lib/reactions/types.ts` and add `likes: number`, `dislikes: number`, `userReaction: ReactionType | null` to the `Comment` interface (applies to both top-level comments and replies, since both use `Comment`).

## 2. API Service

- [x] 2.1 Add `addOrUpdateCommentReaction(commentId: string, type: ReactionType)` to `src/lib/comments/service.ts` — `POST /api/v1/comments/:commentId/reactions` with body `{ type }`, returning the updated `{ likes, dislikes, userReaction }` summary. Follow the existing `isConfigured()` guard used by other functions in this file.
- [x] 2.2 Add `removeCommentReaction(commentId: string)` to `src/lib/comments/service.ts` — `DELETE /api/v1/comments/:commentId/reactions`. Confirmed against the backend source that this responds 204 No Content, so the function returns `Promise<void>` rather than a summary (unlike the POST endpoint).
- [x] 2.3 Add/extend unit tests in `src/__tests__/lib/comments/service.test.ts` for both functions, following the existing mocked-`http` pattern in that file (success responses and the `isConfigured()` short-circuit).

## 3. React Query Hook

- [x] 3.1 Create `src/hooks/useCommentReaction.ts` exporting `useCommentReaction(articleId: string, commentId: string)`, using `useMutation` over `addOrUpdateCommentReaction` / `removeCommentReaction`.
- [x] 3.2 Implement a pure tree-patch helper (co-located in the same file or a small local utility) that takes the cached `Comment[]` for `["comments", articleId]` and returns a new array with the matching top-level comment or nested reply's `likes`/`dislikes`/`userReaction` replaced by a given summary, leaving everything else referentially unchanged.
- [x] 3.3 On mutation success, call `queryClient.setQueryData(["comments", articleId], ...)` using the tree-patch helper — for create/change, patched with the backend's returned summary; for removal (whose 204 response has no body), patched by decrementing the affected node's own last-known count and clearing `userReaction`. No invalidation of the comments query.
- [x] 3.4 On mutation error, if the error is a 401 (`axios.isAxiosError(error) && error.response?.status === 401`), clear the `["currentUser"]` cache, mirroring `useArticleReactions`.
- [x] 3.5 Return `{ react: (type: ReactionType) => void, remove: () => void, isReacting: boolean, reactionError: unknown }` (naming to match existing hook conventions in the codebase) from the hook.
- [x] 3.6 Add `src/__tests__/hooks/useCommentReaction.test.tsx` covering: create reaction, switch reaction, remove reaction, the tree-patch correctly updates a reply nested under a different comment without touching siblings, and the 401 path clearing `["currentUser"]`.

## 4. Reusable Reaction Component

- [x] 4.1 Create `src/components/CommentReaction.tsx` accepting `{ articleId, articleSlug, commentId, likes, dislikes, userReaction }`, rendering Like/Dislike controls modeled visually on `src/components/ArticleReactions.tsx` (same icon set, active-state styling, `aria-pressed`/`aria-label`, disabled state while pending).
- [x] 4.2 Implement click handling: unauthenticated visitor → `markPendingLoginCheck()` + redirect via `getLoginUrl(...)`; loading auth state → no-op; authenticated and target reaction already active → call `remove()`; authenticated and target reaction not active → call `react(type)`.
- [x] 4.3 Render mutation errors inline as `<p role="alert">` with a generic message, matching the existing comments/reactions error convention (no raw backend error text).
- [x] 4.4 Add `src/__tests__/components/CommentReaction.test.tsx` covering: like/dislike counts render, active state renders for `userReaction: "LIKE"` / `"DISLIKE"` / `null`, clicking Like/Dislike triggers the mutation, clicking the active reaction removes it, switching reactions triggers the mutation, unauthenticated click triggers the LinkedIn redirect without calling the mutation, and the component behaves identically when used for a reply.

## 5. Integration into Comments and Replies

- [x] 5.1 Update `src/components/CommentItem.tsx` to render `<CommentReaction articleId={articleId} articleSlug={articleSlug} commentId={comment.id} likes={comment.likes} dislikes={comment.dislikes} userReaction={comment.userReaction} />` alongside the existing reply/edit/delete actions, for both top-level comments and (via the existing recursive rendering) replies, including for the user's own comments and replies.
- [x] 5.2 Update `src/__tests__/components/CommentItem.test.tsx` to assert reaction controls are present for both a top-level comment and a rendered reply, including when the comment/reply is owned by the current user.

## 6. Verification

- [x] 6.1 Run the full test suite and confirm no regressions in existing article-reactions or comments tests.
- [x] 6.2 Run TypeScript compilation and linting; confirm no `any` types were introduced.
- [x] 6.3 Manually verify in the browser against the running local backend: confirmed the article page loads without console errors or regressions to the existing article reactions/comments UI (no comments exist yet on the only seeded article, so the new per-comment controls have no data to render against without a real LinkedIn login - not attempted, since forging a session was judged out of scope). While investigating how to seed a test session, confirmed directly against the `personal-resume-backend` source that `DELETE /comments/:id/reactions` returns 204 with no body - this caught and fixed a real contract bug (see design.md Decisions 2-3): the original implementation expected a summary back from the delete call. Click-through, keyboard, and mobile-layout coverage for the actual Like/Dislike interactions is provided by the automated test suite (`CommentReaction.test.tsx`, `useCommentReaction.test.tsx`); recommend a follow-up manual pass once a real comment exists (log in via LinkedIn and post one).
