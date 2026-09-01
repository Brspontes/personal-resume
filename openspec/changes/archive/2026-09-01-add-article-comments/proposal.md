## Why

The backend (`personal-resume-backend`) already implements comments and one-level replies on top of the same LinkedIn session used by reactions — confirmed live against its OpenAPI document (`GET /api/docs-json`) at `http://localhost:3000`. This change wires the individual article page to that existing API so visitors can read the discussion and, once signed in, participate in it, reusing the auth, HTTP client, and query conventions already established by the reactions feature.

## What Changes

- Add a comments section to the individual article page: a list of top-level comments with their (one level of) replies, and a form to post a new top-level comment.
- Authenticated visitors can reply to a top-level comment, edit their own comment/reply, and delete their own comment/reply (soft-delete, confirmed inline before submitting).
- Unauthenticated visitors can read all comments and replies, but see a LinkedIn sign-in prompt instead of a form when they try to comment or reply — reusing the exact `useCurrentUser` status/login-redirect pattern already built for reactions, not a new authentication path.
- Add `src/lib/comments/{types,service}.ts` and three hooks (`useArticleComments`, `useCreateComment`, `useUpdateComment`, `useDeleteComment`) following the same Axios → service → React Query hook → UI layering already established by reactions. `useCreateComment` also creates replies (a reply is a comment with `parentCommentId` set) — no separate reply service/hook, since the backend treats both as the same operation.
- Relocate the shared Axios instance from `src/lib/reactions/http.ts` to `src/lib/backend/http.ts` so both reactions and comments depend on one client instead of comments importing from a feature-named `reactions` module. `src/lib/reactions/service.ts` is updated to import from the new location; no behavior changes.

### Correction versus the initial request

The request's `CommentAuthorDto` examples included a `linkedinUrl` field ("Author LinkedIn profile when provided"). The backend's actual, live-confirmed `CommentAuthorDto` only returns `id`, `name`, and an optional `avatarUrl` — no profile URL. Since the original requirement was already conditional ("when provided"), this change simply never provides it: comment authors show name and avatar (when present), with no outbound LinkedIn link. The "LinkedIn Profile" section of the request does not apply to this backend today.

## Capabilities

### New Capabilities
- `article-comments`: The comments/replies UI on the article detail page and its integration with the backend's comments endpoints — retrieval, creation, replies, edit, delete, ownership-gated actions, and error handling.

### Modified Capabilities
_None._ `linkedin-authentication` is reused as-is (no new requirements). `article-reactions`'s observable behavior is unchanged; moving its underlying HTTP client to a shared module is an internal implementation detail, not a behavior change.

## Impact

- `src/app/articles/[slug]/page.tsx`: renders `<ArticleComments articleId={article._id} />` after `<ArticleReactions />`.
- `src/lib/backend/http.ts` (new, relocated from `src/lib/reactions/http.ts`): the shared Axios instance.
- `src/lib/reactions/service.ts`: import path updated to `@/lib/backend/http`; no behavior change.
- `src/lib/comments/types.ts` (new): types mirroring the backend's documented DTOs (`Comment`, `CommentAuthor`).
- `src/lib/comments/service.ts` (new): `getComments`, `createComment`, `updateComment`, `deleteComment`.
- `src/hooks/useArticleComments.ts`, `src/hooks/useCommentMutations.ts` (new): the React Query hooks.
- `src/components/ArticleComments.tsx`, `src/components/CommentItem.tsx`, `src/components/CommentForm.tsx` (new): the UI.
- No changes to the backend repository, to Sanity, or to the existing reactions feature's behavior.
