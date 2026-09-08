"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateCommentReaction, removeCommentReaction } from "@/lib/comments/service";
import type { Comment } from "@/lib/comments/types";
import type { ReactionSummary, ReactionType } from "@/lib/reactions/types";

type ReactionPatch = Pick<Comment, "likes" | "dislikes" | "userReaction">;

// Comments nest at most one level deep (top-level comments + replies), so
// patching the tree is a two-level walk rather than a general recursive
// algorithm - matching the "One Level of Reply Nesting" rule the comments
// feature already enforces. `computePatch` receives the node as it currently
// stands in the cache, so a removal can derive its new counts from the
// node's own last known state.
function patchCommentTree(
  comments: Comment[],
  commentId: string,
  computePatch: (node: Comment) => ReactionPatch,
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, ...computePatch(comment) };
    }
    if (comment.replies.some((reply) => reply.id === commentId)) {
      return {
        ...comment,
        replies: comment.replies.map((reply) =>
          reply.id === commentId ? { ...reply, ...computePatch(reply) } : reply,
        ),
      };
    }
    return comment;
  });
}

export function useCommentReaction(articleId: string, commentId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["comments", articleId];

  const mutation = useMutation({
    mutationFn: async (type: ReactionType | null): Promise<ReactionSummary | null> => {
      if (type === null) {
        // The removal endpoint responds 204 No Content, so there is no
        // fresh summary to read back here - the decrement is computed from
        // the node's prior state in onSuccess instead.
        await removeCommentReaction(commentId);
        return null;
      }
      return addOrUpdateCommentReaction(commentId, type);
    },
    onSuccess: (data, type) => {
      queryClient.setQueryData<Comment[]>(queryKey, (comments) =>
        comments
          ? patchCommentTree(comments, commentId, (node) =>
              type === null
                ? {
                    likes: node.userReaction === "LIKE" ? node.likes - 1 : node.likes,
                    dislikes: node.userReaction === "DISLIKE" ? node.dislikes - 1 : node.dislikes,
                    userReaction: null,
                  }
                : // type !== null means mutationFn returned the backend's summary, not null.
                  (data as ReactionSummary),
            )
          : comments,
      );
    },
    onError: (error) => {
      // Session expired mid-mutation: reflect it in the shared auth cache so
      // the next click prompts login instead of retrying a doomed request.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        queryClient.setQueryData(["currentUser"], null);
      }
    },
  });

  return {
    react: (type: ReactionType) => mutation.mutate(type),
    remove: () => mutation.mutate(null),
    isReacting: mutation.isPending,
    reactionError: mutation.error,
  };
}
