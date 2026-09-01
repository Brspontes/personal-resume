import { http, reactionsApiBaseUrl } from "@/lib/backend/http";
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
