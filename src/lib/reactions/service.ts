import axios from "axios";
import { http, reactionsApiBaseUrl } from "./http";
import type { CurrentUser, ReactionSummary, ReactionType } from "./types";

const EMPTY_SUMMARY: ReactionSummary = { likes: 0, dislikes: 0, userReaction: null };

// Mirrors the Sanity integration's "not provisioned" fallback: when the
// reactions API isn't configured, reads resolve to their empty/unauthenticated
// shape instead of issuing a request against an empty base URL.
function isConfigured(): boolean {
  return Boolean(reactionsApiBaseUrl);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isConfigured()) {
    return null;
  }

  try {
    const { data } = await http.get<CurrentUser>("/api/v1/auth/me");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function getReactionSummary(articleId: string): Promise<ReactionSummary> {
  if (!isConfigured()) {
    return EMPTY_SUMMARY;
  }

  const { data } = await http.get<ReactionSummary>(`/api/v1/articles/${articleId}/reactions`);
  return data;
}

export async function submitReaction(
  articleId: string,
  type: ReactionType,
): Promise<ReactionSummary> {
  const { data } = await http.post<ReactionSummary>(`/api/v1/articles/${articleId}/reactions`, {
    type,
  });
  return data;
}

export function getLoginUrl(returnTo: string): string {
  const url = new URL("/api/v1/auth/linkedin", reactionsApiBaseUrl);
  url.searchParams.set("returnTo", returnTo);
  return url.toString();
}
