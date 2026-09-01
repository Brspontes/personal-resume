## 1. Shared HTTP Client Relocation

- [x] 1.1 Move `src/lib/reactions/http.ts` to `src/lib/backend/http.ts` (same `axios.create({ baseURL: process.env.NEXT_PUBLIC_REACTIONS_API_URL, withCredentials: true })`, same exported names `http` and `reactionsApiBaseUrl`).
- [x] 1.2 Update `src/lib/reactions/service.ts`'s import from `./http` to `@/lib/backend/http`.
- [x] 1.3 Run the existing reactions test suite (`src/__tests__/lib/reactions/**`, `src/__tests__/hooks/useCurrentUser.test.tsx`, `src/__tests__/hooks/useArticleReactions.test.tsx`, `src/__tests__/components/ArticleReactions.test.tsx`) to confirm the relocation is behavior-neutral before writing any comments code.

## 2. Types and Service

- [x] 2.1 Add `src/lib/comments/types.ts` with `CommentAuthor { id, name, avatarUrl? }` and `Comment { id, content: string | null, author: CommentAuthor, isOwner, createdAt, updatedAt, deletedAt: string | null, replies: Comment[] }`, mirroring the backend's documented `CommentDto`.
- [x] 2.2 Add `src/lib/comments/service.ts` with `getComments(articleId)`, `createComment(articleId, { content, parentCommentId? })`, `updateComment(commentId, content)`, `deleteComment(commentId)`, built on `@/lib/backend/http`. `getComments` returns `[]` when `NEXT_PUBLIC_REACTIONS_API_URL` is unset, matching the reactions service's "not configured" fallback.

## 3. React Query Hooks

- [x] 3.1 Add `src/hooks/useArticleComments.ts`: `useQuery({ queryKey: ["comments", articleId], queryFn: () => getComments(articleId) })`.
- [x] 3.2 Add `src/hooks/useCommentMutations.ts` with `useCreateComment(articleId)`, `useUpdateComment(articleId)`, `useDeleteComment(articleId)`. Each is a `useMutation` that, on success, calls `queryClient.invalidateQueries({ queryKey: ["comments", articleId] })`; on a 401 error, also writes `null` into `["currentUser"]` (mirrors `useArticleReactions`'s session-expiry handling); on a 403 error, still invalidates `["comments", articleId]` to reconcile the UI with the backend's authoritative state.

## 4. Comment Components

- [x] 4.1 Add `src/components/CommentForm.tsx`: a reusable content-textarea + submit form accepting `{ onSubmit(content), isSubmitting, submitLabel, onCancel? }`; disables submit for empty/whitespace-only content and while `isSubmitting`; clears its input on successful submission.
- [x] 4.2 Add `src/components/CommentItem.tsx` accepting a `Comment`, `articleId`, `articleSlug`, and `canReply: boolean`: renders author (name + avatar when present), content (or a "deleted" placeholder if `deletedAt` is set), relative/formatted timestamps, and:
  - Reply action (visible whenever `canReply` is true, matching `ArticleReactions`'s pattern rather than hiding it for unauthenticated visitors — reconciled during implementation to satisfy the spec's "Authentication Required to Comment" scenario, which requires an unauthenticated *attempt* to redirect to login, not just a hidden control): clicking it redirects to LinkedIn login when `status === "unauthenticated"`, otherwise opens a `CommentForm` for a reply, wired to `useCreateComment(articleId)` with `parentCommentId` set to this comment's id.
  - Edit action (only when `comment.isOwner`) that swaps content for a `CommentForm` pre-filled with the current content, wired to `useUpdateComment(articleId)`.
  - Delete action (only when `comment.isOwner`) that swaps the action row for an inline "Confirm delete? / Cancel" step before calling `useDeleteComment(articleId)`.
  - Recursively renders `comment.replies` as nested `CommentItem`s with `canReply={false}`.
  - Generic inline error messages (not raw error text) for failed edit/delete/reply mutations.
  - Deleted-comment visibility (added post-launch, per user feedback after manual testing, refined once more when a follow-up edge case surfaced): renders nothing (`return null`) when `deletedAt` is set and none of `comment.replies` has `deletedAt === null` — this covers every deleted reply (replies can't have their own replies), a deleted top-level comment with no replies, and a deleted top-level comment whose replies are *all* also deleted (no visible reply left to preserve context for). When `deletedAt` is set and at least one reply is not itself deleted, still shows the "Comentário removido." placeholder so that reply keeps its thread context. `ArticleComments` filters this same condition into its own `visibleComments` list so the heading count and empty-state check aren't thrown off by comments that render nothing.
- [x] 4.3 Add `src/components/ArticleComments.tsx` (Client Component) accepting `{ articleId, articleSlug }` (added `articleSlug`, matching `ArticleReactions`'s signature, since the login redirect needs the article path): renders a heading, the comments count/empty state, a top-level `CommentForm` (or the LinkedIn sign-in prompt when unauthenticated, reusing `useCurrentUser`'s `status`/`getLoginUrl` exactly as `ArticleReactions` does), and the list of top-level comments via `CommentItem`. Tracks which comment (if any) currently has an open reply form as a single `replyingToId` state, passed down so only one reply form is open at a time.
- [x] 4.4 Style all of the above using the project's existing spacing/typography/border conventions (see `ArticleReactions.tsx`, `ArticleCard.tsx`); keep reply indentation modest so nested replies stay usable on mobile widths.

## 5. Article Page Integration

- [x] 5.1 Render `<ArticleComments articleId={article._id} articleSlug={article.slug} />` in `src/app/articles/[slug]/page.tsx`, after `<ArticleReactions />`.

## 6. Tests

- [x] 6.1 `src/__tests__/lib/comments/service.test.ts`, mocking the shared Axios instance: each service function sends the documented method/path/body and parses the response; `getComments` returns `[]` when unconfigured.
- [x] 6.2 `src/__tests__/hooks/useArticleComments.test.tsx`: the query reflects a mocked comment list, rendered inside a fresh `QueryClientProvider`.
- [x] 6.3 `src/__tests__/hooks/useCommentMutations.test.tsx`: each mutation hook invalidates `["comments", articleId]` on success; a 401 error also clears `["currentUser"]`; a 403 error still invalidates comments.
- [x] 6.4 `src/__tests__/components/CommentItem.test.tsx`, covering:
  - renders author, content, and nested replies
  - shows a "deleted" placeholder when `deletedAt` is set
  - shows Edit/Delete only when `isOwner` is true
  - reply action is hidden when `canReply` is false
  - edit submits updated content and delete requires confirmation before calling the delete mutation
- [x] 6.5 `src/__tests__/components/ArticleComments.test.tsx`, mocking `useCurrentUser`, `useArticleComments`, and the mutation hooks, covering:
  - renders the empty state when there are no comments
  - authenticated visitor can submit a new top-level comment; empty/whitespace-only content is not submitted
  - unauthenticated visitor sees the LinkedIn sign-in prompt instead of the comment form
  - only one reply form is open at a time across multiple comments
  - a mutation error surfaces a generic message, not raw error text
  - keyboard operability and accessible names on the interactive controls

## 7. Verification

- [x] 7.1 Run `npm run build`, `npm run lint`, and `npm test`; fix any errors. (Found and fixed a real type issue: the shared `baseMutation()` test helper in `ArticleComments.test.tsx`/`CommentItem.test.tsx` was pinned to `useCreateComment`'s type via inference, incompatible when reused for `useUpdateComment`/`useDeleteComment` — generalized it with an explicit generic parameter.)
- [x] 7.2 Manual local verification against the real backend. **Partially completed**: the Chrome browser extension was not connected in this session (`tabs_context_mcp` reported "Browser extension is not connected"), so no UI clicks could be performed. What *was* confirmed against the real, running backend (port 3000) and dev frontend (port 3001): `GET /api/v1/articles/{articleId}/comments` returns `[]` for the test article; the article page's server-rendered HTML includes the "Comentários" heading, confirming `ArticleComments` mounts and successfully calls the real backend at request time. Not verified live: posting a comment, replying, editing, deleting, soft-delete placeholder rendering, and per-account Edit/Delete visibility — these are covered by the automated test suite (task 6.4/6.5) but not exercised against the real backend end-to-end. Needs a follow-up manual pass once the browser extension is reconnected.
- [ ] 7.3 Manually verify the comments section at mobile and desktop viewport widths, and via keyboard-only navigation. **Not completed** — blocked by the same browser extension unavailability as 7.2.
- [x] 7.4 Run `openspec validate --change add-article-comments --strict` and fix any reported issues.
