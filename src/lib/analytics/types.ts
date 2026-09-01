export type AnalyticsEventType = "ARTICLE_VIEW" | "ARTICLE_PROGRESS" | "ARTICLE_READ";

export interface RecordAnalyticsEvent {
  event: AnalyticsEventType;
  articleId: string;
  sessionId: string;
  progress?: 25 | 50 | 75 | 90;
  duration?: number;
  maxProgress?: number;
}
