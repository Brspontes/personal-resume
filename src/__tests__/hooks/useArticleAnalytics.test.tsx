import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useArticleAnalytics } from "@/hooks/useArticleAnalytics";
import {
  getOrCreateSessionId,
  sendArticleReadBeacon,
  trackArticleProgress,
  trackArticleView,
} from "@/lib/analytics/service";

vi.mock("@/lib/analytics/service", () => ({
  getOrCreateSessionId: vi.fn(),
  trackArticleView: vi.fn(),
  trackArticleProgress: vi.fn(),
  sendArticleReadBeacon: vi.fn(),
}));

function setArticleContentRect(top: number, height = 1000) {
  let element = document.getElementById("article-content");
  if (!element) {
    element = document.createElement("div");
    element.id = "article-content";
    document.body.appendChild(element);
  }
  element.getBoundingClientRect = vi.fn().mockReturnValue({
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => {},
  });
  return element;
}

let rafCallbacks: FrameRequestCallback[] = [];

function flushRaf() {
  const callbacks = rafCallbacks;
  rafCallbacks = [];
  callbacks.forEach((callback) => callback(0));
}

function scrollTo(top: number) {
  setArticleContentRect(top);
  window.dispatchEvent(new Event("scroll"));
  flushRaf();
}

function setVisibility(state: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", {
    value: state,
    configurable: true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  vi.mocked(getOrCreateSessionId).mockReturnValue("session-1");
  vi.mocked(trackArticleView).mockResolvedValue(undefined);
  vi.mocked(trackArticleProgress).mockResolvedValue(undefined);

  rafCallbacks = [];
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());

  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useArticleAnalytics", () => {
  it("sends ARTICLE_VIEW once on mount, with the correct articleId", () => {
    renderHook(() => useArticleAnalytics("article-1"));

    expect(trackArticleView).toHaveBeenCalledTimes(1);
    expect(trackArticleView).toHaveBeenCalledWith("article-1");
  });

  it("sends each of the 25/50/75/90 milestones exactly once, even when scroll crosses a milestone multiple times", () => {
    renderHook(() => useArticleAnalytics("article-1"));

    act(() => scrollTo(750)); // 25%
    act(() => scrollTo(500)); // 50%
    act(() => scrollTo(750)); // back to 25% - already sent
    act(() => scrollTo(250)); // 75%
    act(() => scrollTo(100)); // 90%

    expect(trackArticleProgress).toHaveBeenCalledTimes(4);
    expect(trackArticleProgress).toHaveBeenNthCalledWith(1, "article-1", "session-1", 25);
    expect(trackArticleProgress).toHaveBeenNthCalledWith(2, "article-1", "session-1", 50);
    expect(trackArticleProgress).toHaveBeenNthCalledWith(3, "article-1", "session-1", 75);
    expect(trackArticleProgress).toHaveBeenNthCalledWith(4, "article-1", "session-1", 90);
  });

  it("does not count time while the tab is hidden toward the reading duration", () => {
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(0);
    const { unmount } = renderHook(() => useArticleAnalytics("article-1"));

    dateNowSpy.mockReturnValue(10_000); // 10s pass while hidden - must not count
    act(() => setVisibility("visible"));

    dateNowSpy.mockReturnValue(15_000); // 5s of actual visible reading

    unmount();

    expect(sendArticleReadBeacon).toHaveBeenCalledWith("article-1", "session-1", 5, 0);
  });

  it("sends ARTICLE_READ with the accumulated duration and max progress when the tab becomes hidden, and does not send it a second time on unmount", () => {
    const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(0);
    const { unmount } = renderHook(() => useArticleAnalytics("article-1"));

    act(() => scrollTo(500)); // 50%

    dateNowSpy.mockReturnValue(10_000); // 10s visible
    act(() => setVisibility("hidden"));

    expect(sendArticleReadBeacon).toHaveBeenCalledTimes(1);
    expect(sendArticleReadBeacon).toHaveBeenCalledWith("article-1", "session-1", 10, 50);

    unmount();

    expect(sendArticleReadBeacon).toHaveBeenCalledTimes(1);
  });

  it("sends ARTICLE_READ on unmount (simulating navigation to a different article) when the tab was never hidden", () => {
    const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(0);
    const { unmount } = renderHook(() => useArticleAnalytics("article-1"));

    act(() => scrollTo(750)); // 25%

    dateNowSpy.mockReturnValue(8_000); // 8s visible

    unmount();

    expect(sendArticleReadBeacon).toHaveBeenCalledTimes(1);
    expect(sendArticleReadBeacon).toHaveBeenCalledWith("article-1", "session-1", 8, 25);
  });

  it("sends ARTICLE_READ on a pagehide event (covers a plain reload/close, where visibilitychange does not reliably fire), and does not send it again on unmount", () => {
    const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(0);
    const { unmount } = renderHook(() => useArticleAnalytics("article-1"));

    act(() => scrollTo(500)); // 50%

    dateNowSpy.mockReturnValue(6_000); // 6s visible
    act(() => window.dispatchEvent(new Event("pagehide")));

    expect(sendArticleReadBeacon).toHaveBeenCalledTimes(1);
    expect(sendArticleReadBeacon).toHaveBeenCalledWith("article-1", "session-1", 6, 50);

    unmount();

    expect(sendArticleReadBeacon).toHaveBeenCalledTimes(1);
  });

  it("resets progress and timing state when articleId changes, unaffected by the previous article's state", () => {
    const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(0);
    const { rerender, unmount } = renderHook(
      ({ articleId }: { articleId: string }) => useArticleAnalytics(articleId),
      { initialProps: { articleId: "article-1" } },
    );

    act(() => scrollTo(250)); // 75% for article-1 (crosses 25/50/75 in one jump)
    dateNowSpy.mockReturnValue(20_000); // 20s reading article-1

    // Simulates the fresh, unscrolled position of article-2's content area,
    // as it would be right after client-side navigation to a new article.
    setArticleContentRect(1000);
    rerender({ articleId: "article-2" });

    expect(sendArticleReadBeacon).toHaveBeenCalledTimes(1);
    expect(sendArticleReadBeacon).toHaveBeenCalledWith("article-1", "session-1", 20, 75);
    expect(trackArticleView).toHaveBeenLastCalledWith("article-2");

    // Article 2 must reach its own 25% milestone even though article-1 already
    // sent 25% - state must not have carried over.
    act(() => scrollTo(750)); // 25% for article-2
    expect(trackArticleProgress).toHaveBeenCalledWith("article-2", "session-1", 25);

    dateNowSpy.mockReturnValue(25_000); // 5s reading article-2
    unmount();

    expect(sendArticleReadBeacon).toHaveBeenCalledTimes(2);
    expect(sendArticleReadBeacon).toHaveBeenCalledWith("article-2", "session-1", 5, 25);
  });
});
