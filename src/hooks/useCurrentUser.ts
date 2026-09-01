"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, getLoginUrl } from "@/lib/reactions/service";
import type { CurrentUser } from "@/lib/reactions/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

const POST_LOGIN_RECHECK_KEY = "post_login_recheck";
const POST_LOGIN_RECHECK_DELAY_MS = 800;

// Some browsers (notably Safari's Intelligent Tracking Prevention, which
// treats the LinkedIn -> backend -> frontend redirect chain as a potential
// bounce-tracking pattern) restrict the just-set session cookie on the very
// first request after login, even though it was genuinely stored. Call this
// right before sending the visitor to LinkedIn so that if the check right
// after they return still reads as unauthenticated, the hook retries once,
// automatically, instead of requiring a manual reload.
export function markPendingLoginCheck(): void {
  try {
    window.sessionStorage.setItem(POST_LOGIN_RECHECK_KEY, "1");
  } catch {
    // sessionStorage unavailable - the visitor simply won't get the
    // automatic retry; they can still reload manually.
  }
}

// No separate AuthContext: this hook's query cache, keyed by ["currentUser"],
// is what shares and deduplicates the resolved auth state across every
// component that calls it (ArticleReactions today, a future ArticleComments).
export function useCurrentUser(): {
  user: CurrentUser | null;
  status: AuthStatus;
  getLoginUrl: (returnTo: string) => string;
} {
  const queryClient = useQueryClient();
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    // The flag is consumed on the first resolution either way, so it can
    // never affect a later, unrelated query - it only ever triggers one
    // retry per login attempt.
    let hasPendingCheck = false;
    try {
      hasPendingCheck = window.sessionStorage.getItem(POST_LOGIN_RECHECK_KEY) === "1";
      if (hasPendingCheck) {
        window.sessionStorage.removeItem(POST_LOGIN_RECHECK_KEY);
      }
    } catch {
      return;
    }

    if (!hasPendingCheck || data) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }, POST_LOGIN_RECHECK_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isSuccess, data, queryClient]);

  const status: AuthStatus = isPending
    ? "loading"
    : data
      ? "authenticated"
      : "unauthenticated";

  return { user: data ?? null, status, getLoginUrl };
}
