## Context

See proposal.md - Why. This section only captures the current-state facts that shape the approach, gathered by inspecting the existing frontend:

- **Article reactions** (`src/lib/reactions/{types,service}.ts`, `src/hooks/useArticleReactions.ts`, `src/components/ArticleReactions.tsx`): `ReactionType = "LIKE" | "DISLIKE"`; `ReactionSummary = { likes, dislikes, userReaction }`; the service POSTs `{ type }` and the backend response is the fresh `ReactionSummary`, which the mutation's `onSuccess` writes directly into the query cache (`queryClient.setQueryData`) — no optimistic `onMutate`. A 401 clears `["currentUser"]` so the next click re-triggers login. The component redirects unauthenticated visitors to `getLoginUrl(...)` via a full page navigation, calling `markPendingLoginCheck()` first.
- **Comments** (`src/lib/comments/{types,service}.ts`, `src/hooks/useArticleComments.ts`, `src/hooks/useCommentMutations.ts`, `src/components/{ArticleComments,CommentItem}.tsx`): `Comment` has no reaction fields today. Comments and replies share the same `Comment` type and the same `CommentItem` component — `CommentItem` renders itself recursively for `comment.replies`. The comments cache lives at `["comments", articleId]` as one nested tree (comments with one level of replies, per the existing `article-comments` spec's "One Level of Reply Nesting" requirement). Existing comment mutations (create/update/delete) invalidate that query key rather than patching the tree directly.
- **Transport**: a single shared Axios instance (`src/lib/backend/http.ts`, `withCredentials: true`, no interceptors); 401 handling is done ad hoc per hook via `axios.isAxiosError(error) && error.response?.status === 401`.
- **No toast library** is present; errors render inline as `<p role="alert">` driven by `mutation.isError`.
- **Testing**: Vitest + Testing Library, mirrored under `src/__tests__/{components,hooks,lib/<domain>}`, hooks tested with a fresh `QueryClient` per test, services tested with mocked `http`.

## Goals / Non-Goals

**Goals:**
- Reuse the article-reactions request/cache pattern (direct cache write from the mutation response, no optimistic update) for comment/reply reactions.
- Keep the nested comment tree in `["comments", articleId]` as the single source of truth, patching only the affected node instead of invalidating the whole tree.
- Render one reusable `CommentReaction` component from `CommentItem`, so replies get reactions "for free" through the existing recursive rendering.

**Non-Goals:**
- No optimistic UI (matches the existing article-reactions behavior, which also doesn't optimistically update).
- No shared cross-cutting "require auth then do X" hook extraction — the redirect-to-login block stays inline, matching (and not refactoring) the existing duplicated pattern in `ArticleReactions.tsx` / `CommentItem.tsx`.
- No changes to comment creation, editing, deletion, or nesting behavior.

## Decisions

**1. Reuse `ReactionType` from `src/lib/reactions/types.ts`; extend `Comment` with a `reaction` summary.**
`src/lib/comments/types.ts` imports `ReactionType` rather than redeclaring the union (avoids duplicating the `"LIKE" | "DISLIKE"` literal type). `Comment` gains:
```ts
likes: number;
dislikes: number;
userReaction: ReactionType | null;
```
directly on the interface (not a nested object), matching the flat style of the existing `ReactionSummary` fields and keeping `replies: Comment[]` automatically carrying the same fields for free.
*Alternative considered*: a separate `CommentReactionSummary` type. Rejected — `Comment` and its replies already share one interface, and the article-reactions precedent puts these three fields at the top level, not nested.

**2. Add reaction functions to the existing `src/lib/comments/service.ts` rather than a new service module.**
`addOrUpdateCommentReaction(commentId, type)` → `POST /api/v1/comments/:commentId/reactions` with body `{ type }`, returning the fresh `{ likes, dislikes, userReaction }` summary (confirmed against the `personal-resume-backend` source: `comment-reactions.controller.ts` returns 201 with that shape, plus a harmless extra `commentId` field the frontend ignores). `removeCommentReaction(commentId)` → `DELETE /api/v1/comments/:commentId/reactions`, which the same backend source confirms responds **204 No Content with no body** — unlike the POST endpoint, it does not return a summary. `removeCommentReaction`'s return type is therefore `Promise<void>`, and the hook (Decision 3) computes the post-removal counts locally instead of reading them from a response that doesn't exist.
*Alternative considered*: a standalone `commentReactionsApi` module (as the request's "conceptually" naming suggests). Rejected in favor of extending `comments/service.ts` because comment reactions are not a standalone resource from the frontend's perspective — they're a facet of a comment, and the existing `reactions` vs `comments` module split is already the project's precedent for "one module per top-level resource type" (article vs. comment), not one per interaction type.

**3. `useCommentReaction(articleId, commentId)` patches the specific node in the `["comments", articleId]` cache on success.**
Mirroring `useArticleReactions`: `onSuccess` calls `queryClient.setQueryData(["comments", articleId], updater)`, where `updater` walks the (at most one level deep) tree — checks the top-level array for `commentId`, then each comment's `replies` — and replaces the matched node's `likes`/`dislikes`/`userReaction`. No invalidation, no full refetch. A 401 clears `["currentUser"]`, same as article reactions.

Because `removeCommentReaction`'s 204 response carries no summary (Decision 2), the patch function is a `(node) => patch` callback rather than a fixed value: for create/change it returns the backend's summary directly; for removal it derives the new counts from the node's *own* last-known state at patch time (`likes - 1` if that node's `userReaction` was `"LIKE"`, `dislikes - 1` if `"DISLIKE"`, `userReaction: null`). This still keeps the backend as the source of truth for every number that reaches the cache — removal only ever subtracts the one count the backend just confirmed it decremented — it just doesn't require a response body to do so.
*Alternative considered*: invalidate `["comments", articleId]` on success (matching `useCommentMutations`' existing convention for create/update/delete). Rejected for reactions specifically because the response already *is* the authoritative new state for that one node — invalidating would trigger an unnecessary full refetch of every comment and reply on the article just to reflect one count change, which the proposal explicitly says to avoid.

**4. No optimistic updates; per-instance mutation state provides scoped loading feedback.**
Because `useCommentReaction` is called once per rendered `CommentReaction` instance (one per comment/reply), each instance's `mutation.isPending` is already scoped to that one comment — no shared "pending set" data structure is needed to keep other comments interactive while one is mid-mutation.

**5. `CommentReaction` component props include `articleId` and `articleSlug` in addition to the reaction data.**
```ts
<CommentReaction
  articleId={articleId}
  articleSlug={articleSlug}
  commentId={comment.id}
  likes={comment.likes}
  dislikes={comment.dislikes}
  userReaction={comment.userReaction}
/>
```
`articleId` is required (beyond the conceptual prop list) because the hook must target the correct `["comments", articleId]` cache entry; `articleSlug` is required because the unauthenticated-redirect path (Decision 6) builds the same `getLoginUrl(`/articles/${articleSlug}`)` return-to URL used by `ArticleReactions` and `CommentItem`. `CommentItem` already receives both props today, so this adds no new prop-drilling path.

**6. Authentication redirect block is copied inline into `CommentReaction`, using the more complete existing version (including `markPendingLoginCheck()`).**
Same `status === "unauthenticated"` → `markPendingLoginCheck()` + `window.location.href = getLoginUrl(...)` → `status !== "authenticated"` → no-op → else mutate, as used in `ArticleReactions.tsx`. This intentionally does not fix the existing minor inconsistency in `CommentItem.tsx`'s reply-click handler (which omits `markPendingLoginCheck()`) — that's a pre-existing issue outside this change's scope.

## Risks / Trade-offs

- **Manual tree-patching logic (Decision 3) is more code than a blanket invalidate** → Mitigated by the tree being at most two levels deep (top-level comments + one level of replies), so the walk is a small, easily-tested pure function, not a general recursive tree algorithm.
- **Per-instance hook calls mean no cross-comment request coordination** → Not a real risk here: each comment's reaction is an independent backend resource, so there is nothing to coordinate across comments.
- **Locally-computed removal counts (Decision 3) could drift from the server under concurrent reactions from other users on the same comment between the last fetch and this removal** → Accepted as a pre-existing class of staleness inherent to any cache-patch approach (the create/change path has the same window until the next full refetch); the removal math only ever adjusts the one bucket the backend just confirmed changed, and a page reload or the next `getComments` fetch reconciles fully.

## Migration Plan

Purely additive frontend change; no data migration. Ships as new component/hook/service code plus a `Comment` type extension. Rollback is a plain revert since no backend or schema changes are involved.
