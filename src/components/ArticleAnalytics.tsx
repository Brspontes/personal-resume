"use client";

import { useArticleAnalytics } from "@/hooks/useArticleAnalytics";

interface ArticleAnalyticsProps {
  articleId: string;
}

export default function ArticleAnalytics({ articleId }: ArticleAnalyticsProps) {
  useArticleAnalytics(articleId);

  return null;
}
