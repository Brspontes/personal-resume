import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  window.localStorage.clear();
});

async function loadService(options: {
  configured: boolean;
  get?: ReturnType<typeof vi.fn>;
  post?: ReturnType<typeof vi.fn>;
}) {
  const get = options.get ?? vi.fn();
  const post = options.post ?? vi.fn().mockResolvedValue({ data: null });

  vi.doMock("@/lib/backend/http", () => ({
    http: { get, post },
    reactionsApiBaseUrl: options.configured ? "http://localhost:9999" : undefined,
  }));

  const service = await import("@/lib/analytics/service");
  return { service, get, post };
}

function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

describe("getOrCreateSessionId", () => {
  it("generates and persists a new id when none exists", async () => {
    const { service } = await loadService({ configured: true });

    const id = service.getOrCreateSessionId();

    expect(id).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem("analytics_session_id")!)).toEqual({
      id,
      date: todayDateString(),
    });
  });

  it("reuses an existing id when it was created on the same day", async () => {
    window.localStorage.setItem(
      "analytics_session_id",
      JSON.stringify({ id: "existing-session-id", date: todayDateString() }),
    );
    const { service } = await loadService({ configured: true });

    expect(service.getOrCreateSessionId()).toBe("existing-session-id");
  });

  it("generates a new id when the stored session is from a previous day", async () => {
    window.localStorage.setItem(
      "analytics_session_id",
      JSON.stringify({ id: "yesterday-session-id", date: "2020-01-01" }),
    );
    const { service } = await loadService({ configured: true });

    const id = service.getOrCreateSessionId();

    expect(id).not.toBe("yesterday-session-id");
    expect(JSON.parse(window.localStorage.getItem("analytics_session_id")!)).toEqual({
      id,
      date: todayDateString(),
    });
  });

  it("generates a new id when the stored value is corrupted or in the legacy (pre-daily-rotation) plain-string format", async () => {
    window.localStorage.setItem("analytics_session_id", "legacy-plain-string-id");
    const { service } = await loadService({ configured: true });

    const id = service.getOrCreateSessionId();

    expect(id).not.toBe("legacy-plain-string-id");
    expect(JSON.parse(window.localStorage.getItem("analytics_session_id")!)).toEqual({
      id,
      date: todayDateString(),
    });
  });

  it("falls back to an in-memory id when localStorage throws", async () => {
    const { service } = await loadService({ configured: true });
    const getItemSpy = vi
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockImplementation(() => {
        throw new Error("localStorage disabled");
      });

    expect(() => service.getOrCreateSessionId()).not.toThrow();
    expect(service.getOrCreateSessionId()).toBeTruthy();

    getItemSpy.mockRestore();
  });
});

describe("trackArticleView", () => {
  it("sends the documented payload shape", async () => {
    window.localStorage.setItem(
      "analytics_session_id",
      JSON.stringify({ id: "session-1", date: todayDateString() }),
    );
    const { service, post } = await loadService({ configured: true });

    await service.trackArticleView("article-1");

    expect(post).toHaveBeenCalledWith("/api/v1/analytics/events", {
      event: "ARTICLE_VIEW",
      articleId: "article-1",
      sessionId: "session-1",
    });
  });

  it("swallows request failures without throwing", async () => {
    const { service } = await loadService({
      configured: true,
      post: vi.fn().mockRejectedValue(new Error("network down")),
    });

    await expect(service.trackArticleView("article-1")).resolves.toBeUndefined();
  });

  it("does not send a request when the API is not configured", async () => {
    const { service, post } = await loadService({ configured: false });

    await service.trackArticleView("article-1");

    expect(post).not.toHaveBeenCalled();
  });
});

describe("trackArticleProgress", () => {
  it("sends the documented payload shape", async () => {
    const { service, post } = await loadService({ configured: true });

    await service.trackArticleProgress("article-1", "session-1", 50);

    expect(post).toHaveBeenCalledWith("/api/v1/analytics/events", {
      event: "ARTICLE_PROGRESS",
      articleId: "article-1",
      sessionId: "session-1",
      progress: 50,
    });
  });

  it("swallows request failures without throwing", async () => {
    const { service } = await loadService({
      configured: true,
      post: vi.fn().mockRejectedValue(new Error("network down")),
    });

    await expect(
      service.trackArticleProgress("article-1", "session-1", 25),
    ).resolves.toBeUndefined();
  });
});

describe("trackArticleRead", () => {
  it("sends the documented payload shape", async () => {
    const { service, post } = await loadService({ configured: true });

    await service.trackArticleRead("article-1", "session-1", 120, 90);

    expect(post).toHaveBeenCalledWith("/api/v1/analytics/events", {
      event: "ARTICLE_READ",
      articleId: "article-1",
      sessionId: "session-1",
      duration: 120,
      maxProgress: 90,
    });
  });

  it("swallows request failures without throwing", async () => {
    const { service } = await loadService({
      configured: true,
      post: vi.fn().mockRejectedValue(new Error("network down")),
    });

    await expect(
      service.trackArticleRead("article-1", "session-1", 120, 90),
    ).resolves.toBeUndefined();
  });
});

describe("sendArticleReadBeacon", () => {
  const originalSendBeacon = navigator.sendBeacon;

  afterEach(() => {
    Object.defineProperty(navigator, "sendBeacon", {
      value: originalSendBeacon,
      configurable: true,
      writable: true,
    });
  });

  it("uses navigator.sendBeacon when available and it succeeds", async () => {
    const sendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeacon,
      configurable: true,
      writable: true,
    });
    const { service, post } = await loadService({ configured: true });

    service.sendArticleReadBeacon("article-1", "session-1", 120, 90);

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon.mock.calls[0][0]).toBe("http://localhost:9999/api/v1/analytics/events");
    expect(post).not.toHaveBeenCalled();
  });

  it("falls back to the Axios path when sendBeacon is unavailable", async () => {
    Object.defineProperty(navigator, "sendBeacon", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    const { service, post } = await loadService({ configured: true });

    service.sendArticleReadBeacon("article-1", "session-1", 120, 90);

    expect(post).toHaveBeenCalledWith("/api/v1/analytics/events", {
      event: "ARTICLE_READ",
      articleId: "article-1",
      sessionId: "session-1",
      duration: 120,
      maxProgress: 90,
    });
  });

  it("falls back to the Axios path when sendBeacon returns false", async () => {
    const sendBeacon = vi.fn().mockReturnValue(false);
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeacon,
      configurable: true,
      writable: true,
    });
    const { service, post } = await loadService({ configured: true });

    service.sendArticleReadBeacon("article-1", "session-1", 120, 90);

    expect(post).toHaveBeenCalledWith("/api/v1/analytics/events", {
      event: "ARTICLE_READ",
      articleId: "article-1",
      sessionId: "session-1",
      duration: 120,
      maxProgress: 90,
    });
  });
});
