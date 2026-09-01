## Context

The backend's live OpenAPI document (`GET /api/docs-json` at `http://localhost:3000`) was inspected directly and confirms the contract this design builds against:

- `GET /api/v1/articles/{articleId}/comments` — 200, `CommentDto[]`. Public (no 401 documented): top-level comments with `replies` nested underneath, `isOwner` set per-item only when the caller is authenticated.
- `POST /api/v1/articles/{articleId}/comments` — body `CreateCommentDto { content: string (max 2000), parentCommentId?: string }` — 201 (created comment), 400 invalid content/parent, 401 no session, 404 parent not found. `parentCommentId` is what turns this into a reply; there is no separate reply endpoint.
- `PATCH /api/v1/comments/{commentId}` — body `UpdateCommentDto { content: string }` — 200, 400 invalid/already deleted, 401, 403 belongs to another user, 404 not found.
- `DELETE /api/v1/comments/{commentId}` — 204 (soft delete), 400 already deleted, 401, 403, 404.
- `CommentDto`: `{ id, content: string | null (null once deleted), author: { id, name, avatarUrl? }, isOwner, createdAt, updatedAt, deletedAt: string | null, replies: CommentDto[] }`. **No LinkedIn profile URL on the author** — see proposal.md's "Correction versus the initial request".
- `articleId` is the Sanity article `_id` (matches the reactions feature's existing convention — `getArticleBySlug` already returns `_id`).
- Nesting is enforced server-side to one level (per the backend's own README: "one level of reply nesting"); `replies` on a reply is never populated in practice, but the type is recursive in the OpenAPI schema.

CORS was reconfirmed live for the frontend's current origin (`http://localhost:3001` → backend on `3000`); no new cross-origin work is needed beyond what reactions already established.

See `proposal.md` - Why, for motivation, and `specs/article-comments/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Reuse every conventions already established by the reactions feature (Axios client, `useCurrentUser`, layering, error/loading patterns) rather than inventing parallel ones.
- Keep the comment tree's server state entirely in React Query; the frontend never maintains its own copy of comment content.

**Non-Goals:**
- A dedicated `useCreateReply` hook/service function — a reply is `createComment` with `parentCommentId` set; a second code path for the same backend operation would be a duplicate abstraction.
- Optimistic updates for comment mutations. The proposal explicitly allows `invalidateQueries`-after-success for the initial implementation, and a comment tree (parent + nested replies, edit-in-place, soft-delete) is exactly the kind of nested structure where hand-rolled optimistic cache surgery is failure-prone. Refetching the article's comment list after a confirmed mutation is simple and correct.
- Building a native `<dialog>`/modal system for delete confirmation. No modal exists anywhere in this codebase; an inline confirm-in-place (swap the Delete button for "Confirm delete? / Cancel") matches the project's existing simplicity and avoids introducing new UI infrastructure for one interaction.
- Pagination. Not present in the current backend contract; the "if the backend supports pagination" clause doesn't apply.

## Decisions

**Relocate the shared Axios instance to `src/lib/backend/http.ts`.**
The proposal's own text requires reusing the reactions feature's Axios client. Today it lives at `src/lib/reactions/http.ts` — importing that from a `comments` module would read as "comments depends on reactions," which isn't true; both depend on the same backend. Moving the client (and the `NEXT_PUBLIC_REACTIONS_API_URL`-derived base URL constant) to a neutral `src/lib/backend/http.ts` and updating `src/lib/reactions/service.ts`'s one import is a small, mechanical, low-risk move — not a behavior change, and not a rename of the env var (still `NEXT_PUBLIC_REACTIONS_API_URL`, since renaming it would touch `.env.local`/`.env.example`/deployment config for no functional gain).

**Module layout mirrors `src/lib/reactions/`:**
- `src/lib/comments/types.ts` — `Comment`, `CommentAuthor`.
- `src/lib/comments/service.ts` — `getComments(articleId)`, `createComment(articleId, { content, parentCommentId? })`, `updateComment(commentId, content)`, `deleteComment(commentId)`. Same "unconfigured base URL → safe fallback" guard as `reactions/service.ts` (`getComments` returns `[]`; mutations are unreachable in that state since the UI already hides them per `useCurrentUser`).
- `src/hooks/useArticleComments.ts` — `useQuery` for the list.
- `src/hooks/useCommentMutations.ts` — `useCreateComment`, `useUpdateComment`, `useDeleteComment`, one `useMutation` each, all invalidating `["comments", articleId]` on success and reusing the reactions hook's 401-clears-`["currentUser"]` pattern on error.
- `src/components/ArticleComments.tsx` — container: heading, empty state, the new-top-level-comment `CommentForm`, and the list.
- `src/components/CommentItem.tsx` — renders one comment (top-level or reply): author, content, timestamps, and owner/reply actions; recurses one level to render its own `replies` as nested `CommentItem`s with `canReply={false}`.
- `src/components/CommentForm.tsx` — one reusable form (content textarea + submit) for three call sites: new comment, new reply, edit-in-place — avoiding three near-identical form components for the sake of the naming-only distinction the request's conceptual sketch draws between `CommentForm` and `ReplyForm`.

**Query key: `["comments", articleId]`**, mirroring reactions' `["reactions", articleId]`. Every mutation hook invalidates this exact key on success; no cross-article leakage since the key includes `articleId`.

**Ownership gating happens in `CommentItem`, driven only by the backend's `isOwner`.** No client-side ownership computation (e.g., comparing `comment.author.id` to the current user's id) — `isOwner` already encodes that, and computing it independently would be exactly the kind of frontend-side authorization the spec forbids relying on.

**Session-expiry handling matches reactions:** on a 401 from any comment mutation, write `null` into the `["currentUser"]` cache so the next attempt shows the login prompt instead of retrying a doomed request. On a 403 (comment no longer owned — e.g., another session on the same account, or a stale UI), invalidate `["comments", articleId]` to reconcile from the backend rather than trusting the local optimistic assumption, and show the generic error message.

**Reply UI: one open reply form at a time**, tracked as a single `replyingToId: string | null` in `ArticleComments`'s local state (not per-`CommentItem` state), passed down to whichever `CommentItem` matches. This directly satisfies the proposal's "only one reply form should be active at a time" guidance with the simplest possible state shape.

## Risks / Trade-offs

[Refetch-after-mutation (vs. optimistic updates) means a visible round-trip before a new comment/reply appears] → Accepted per the proposal's own stated preference for consistency and simplicity over perceived speed for the initial implementation; the busy state on the submit button already communicates that something is happening.

[Recursive `CommentDto.replies` in the OpenAPI schema could theoretically carry a reply's own replies] → The frontend renders only one level regardless of what the payload contains (`canReply={false}` on rendered replies, and no third-level rendering), so this is defensive rather than reliant on the backend's documented one-level business rule holding perfectly.

[Moving `http.ts` touches a file the already-shipped reactions feature depends on] → Confirmed as a pure relocation (same `axios.create` call, same exported names via re-export or updated import), verified by re-running the existing reactions test suite after the move, before writing any comments code.
