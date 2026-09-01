import { http, reactionsApiBaseUrl } from "@/lib/backend/http";
import type { RecordAnalyticsEvent } from "./types";

const SESSION_ID_STORAGE_KEY = "analytics_session_id";
const ANALYTICS_EVENTS_PATH = "/api/v1/analytics/events";

function isConfigured(): boolean {
  return Boolean(reactionsApiBaseUrl);
}

export function getOrCreateSessionId(): string {
  try {
    const existing = window.localStorage.getItem(SESSION_ID_STORAGE_KEY);
    if (existing) {
      return existing;
    }

    const generated = crypto.randomUUID();
    window.localStorage.setItem(SESSION_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    // localStorage unavailable (disabled or strict privacy mode) - fall back
    // to an in-memory id for this page load; analytics for this visitor is
    // simply less able to be correlated across page loads.
    return crypto.randomUUID();
  }
}

async function recordEvent(payload: RecordAnalyticsEvent): Promise<void> {
  if (!isConfigured()) {
    return;
  }

  try {
    await http.post(ANALYTICS_EVENTS_PATH, payload);
  } catch {
    // Analytics failures are non-blocking and never surfaced to the visitor.
  }
}

export async function trackArticleView(articleId: string): Promise<void> {
  await recordEvent({
    event: "ARTICLE_VIEW",
    articleId,
    sessionId: getOrCreateSessionId(),
  });
}

export async function trackArticleProgress(
  articleId: string,
  sessionId: string,
  progress: 25 | 50 | 75 | 90,
): Promise<void> {
  await recordEvent({
    event: "ARTICLE_PROGRESS",
    articleId,
    sessionId,
    progress,
  });
}

export async function trackArticleRead(
  articleId: string,
  sessionId: string,
  duration: number,
  maxProgress: number,
): Promise<void> {
  await recordEvent({
    event: "ARTICLE_READ",
    articleId,
    sessionId,
    duration,
    maxProgress,
  });
}

export function sendArticleReadBeacon(
  articleId: string,
  sessionId: string,
  duration: number,
  maxProgress: number,
): void {
  if (!isConfigured()) {
    return;
  }

  const payload: RecordAnalyticsEvent = {
    event: "ARTICLE_READ",
    articleId,
    sessionId,
    duration,
    maxProgress,
  };

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const sent = navigator.sendBeacon(`${reactionsApiBaseUrl}${ANALYTICS_EVENTS_PATH}`, blob);
    if (sent) {
      return;
    }
  }

  void trackArticleRead(articleId, sessionId, duration, maxProgress);
}
