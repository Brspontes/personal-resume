"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getLoginUrl } from "@/lib/reactions/service";
import type { CurrentUser } from "@/lib/reactions/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// No separate AuthContext: this hook's query cache, keyed by ["currentUser"],
// is what shares and deduplicates the resolved auth state across every
// component that calls it (ArticleReactions today, a future ArticleComments).
export function useCurrentUser(): {
  user: CurrentUser | null;
  status: AuthStatus;
  getLoginUrl: (returnTo: string) => string;
} {
  const { data, isPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const status: AuthStatus = isPending
    ? "loading"
    : data
      ? "authenticated"
      : "unauthenticated";

  return { user: data ?? null, status, getLoginUrl };
}
