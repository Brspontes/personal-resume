import { useEffect } from "react";
import {
  getOrCreateSessionId,
  sendArticleReadBeacon,
  trackArticleProgress,
  trackArticleView,
} from "@/lib/analytics/service";

const PROGRESS_MILESTONES = [25, 50, 75, 90] as const;
const ARTICLE_CONTENT_ELEMENT_ID = "article-content";

export function useArticleAnalytics(articleId: string): void {
  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    void trackArticleView(articleId);

    const sentMilestones = new Set<number>();
    let maxProgress = 0;
    let visibleSince: number | null = document.visibilityState === "visible" ? Date.now() : null;
    let accumulatedVisibleMs = 0;
    let hasSentRead = false;
    let scrollFrame: number | null = null;

    function currentDurationSeconds(): number {
      const openSpanMs = visibleSince !== null ? Date.now() - visibleSince : 0;
      return Math.round((accumulatedVisibleMs + openSpanMs) / 1000);
    }

    function sendReadEvent() {
      if (hasSentRead) {
        return;
      }
      hasSentRead = true;
      sendArticleReadBeacon(articleId, sessionId, currentDurationSeconds(), Math.round(maxProgress));
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        if (visibleSince !== null) {
          accumulatedVisibleMs += Date.now() - visibleSince;
          visibleSince = null;
        }
        sendReadEvent();
      } else if (document.visibilityState === "visible") {
        visibleSince = Date.now();
      }
    }

    function calculateProgress() {
      const element = document.getElementById(ARTICLE_CONTENT_ELEMENT_ID);
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const elementHeight = rect.height;
      if (elementHeight <= 0) {
        return;
      }

      const scrolledPast = window.innerHeight - rect.top;
      const percentage = Math.min(100, Math.max(0, (scrolledPast / elementHeight) * 100));

      if (percentage > maxProgress) {
        maxProgress = percentage;
      }

      for (const milestone of PROGRESS_MILESTONES) {
        if (percentage >= milestone && !sentMilestones.has(milestone)) {
          sentMilestones.add(milestone);
          void trackArticleProgress(articleId, sessionId, milestone);
        }
      }
    }

    function handleScroll() {
      if (scrollFrame !== null) {
        return;
      }
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        calculateProgress();
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    calculateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (scrollFrame !== null) {
        cancelAnimationFrame(scrollFrame);
      }
      sendReadEvent();
    };
  }, [articleId]);
}
