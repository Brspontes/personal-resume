"use client";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReactionSummary, submitReaction } from "@/lib/reactions/service";
import type { ReactionSummary, ReactionType } from "@/lib/reactions/types";

export function useArticleReactions(articleId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["reactions", articleId];

  const { data: summary } = useQuery({
    queryKey,
    queryFn: () => getReactionSummary(articleId),
  });

  const mutation = useMutation({
    mutationFn: (type: ReactionType) => submitReaction(articleId, type),
    onSuccess: (data: ReactionSummary) => {
      // The mutation response already is the fresh summary, so writing it
      // directly into the cache is enough - no invalidateQueries round trip.
      // A failed mutation never reaches here, so the cache (and therefore the
      // UI) is left exactly as it was: the "revert to last confirmed state"
      // behavior falls out of not writing anything on failure.
      queryClient.setQueryData(queryKey, data);
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
    summary,
    react: mutation.mutate,
    isReacting: mutation.isPending,
    reactionError: mutation.error,
  };
}
