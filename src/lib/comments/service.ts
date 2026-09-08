import { http, reactionsApiBaseUrl } from "@/lib/backend/http";
import type { ReactionSummary, ReactionType } from "@/lib/reactions/types";
import type { Comment } from "./types";

function isConfigured(): boolean {
  return Boolean(reactionsApiBaseUrl);
}

export async function getComments(articleId: string): Promise<Comment[]> {
  if (!isConfigured()) {
    return [];
  }

  const { data } = await http.get<Comment[]>(`/api/v1/articles/${articleId}/comments`);
  return data;
}

export async function createComment(
  articleId: string,
  input: { content: string; parentCommentId?: string },
): Promise<Comment> {
  const { data } = await http.post<Comment>(`/api/v1/articles/${articleId}/comments`, input);
  return data;
}

export async function updateComment(commentId: string, content: string): Promise<Comment> {
  const { data } = await http.patch<Comment>(`/api/v1/comments/${commentId}`, { content });
  return data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await http.delete(`/api/v1/comments/${commentId}`);
}

export async function addOrUpdateCommentReaction(
  commentId: string,
  type: ReactionType,
): Promise<ReactionSummary> {
  const { data } = await http.post<ReactionSummary>(`/api/v1/comments/${commentId}/reactions`, {
    type,
  });
  return data;
}

// The backend responds 204 No Content on a successful removal (unlike the
// create/update endpoint, which returns the fresh summary) - there is no
// response body to parse here.
export async function removeCommentReaction(commentId: string): Promise<void> {
  await http.delete(`/api/v1/comments/${commentId}/reactions`);
}
