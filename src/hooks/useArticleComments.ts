"use client";

import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/lib/comments/service";

export function useArticleComments(articleId: string) {
  const { data: comments, isPending } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => getComments(articleId),
  });

  return { comments: comments ?? [], isLoading: isPending };
}
