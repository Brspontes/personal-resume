"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, updateComment } from "@/lib/comments/service";

// Session expired mid-mutation: reflect it in the shared auth cache so the
// next attempt prompts login instead of retrying a doomed request.
function markSessionExpired(queryClient: ReturnType<typeof useQueryClient>, error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    queryClient.setQueryData(["currentUser"], null);
  }
}

// The comment is no longer owned by the caller (stale UI, or ownership
// changed elsewhere) - reconcile from the backend rather than trusting the
// local optimistic assumption.
function reconcileOnForbidden(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[],
  error: unknown,
) {
  if (axios.isAxiosError(error) && error.response?.status === 403) {
    queryClient.invalidateQueries({ queryKey });
  }
}

export function useCreateComment(articleId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["comments", articleId];

  return useMutation({
    mutationFn: (input: { content: string; parentCommentId?: string }) =>
      createComment(articleId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => markSessionExpired(queryClient, error),
  });
}

export function useUpdateComment(articleId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["comments", articleId];

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      markSessionExpired(queryClient, error);
      reconcileOnForbidden(queryClient, queryKey, error);
    },
  });
}

export function useDeleteComment(articleId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["comments", articleId];

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      markSessionExpired(queryClient, error);
      reconcileOnForbidden(queryClient, queryKey, error);
    },
  });
}
