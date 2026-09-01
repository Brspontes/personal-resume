import { describe, expect, it, vi, beforeEach } from "vitest";

// `reactionsApiBaseUrl` is read once at module-load time in `http.ts`, so
// each test resets modules and re-mocks `./http` before dynamically
// importing `service.ts`, letting each case control both the mocked HTTP
// calls and whether the integration is "configured".
beforeEach(() => {
  vi.resetModules();
});

async function loadService(options: { configured: boolean; get?: ReturnType<typeof vi.fn>; post?: ReturnType<typeof vi.fn> }) {
  const get = options.get ?? vi.fn();
  const post = options.post ?? vi.fn();

  vi.doMock("@/lib/backend/http", () => ({
    http: { get, post },
    reactionsApiBaseUrl: options.configured ? "http://localhost:9999" : undefined,
  }));

  const service = await import("@/lib/reactions/service");
  return { service, get, post };
}

describe("getCurrentUser", () => {
  it("returns the user on a successful response", async () => {
    const user = { id: "1", name: "Jane Doe" };
    const { service } = await loadService({
      configured: true,
      get: vi.fn().mockResolvedValue({ data: user }),
    });

    await expect(service.getCurrentUser()).resolves.toEqual(user);
  });

  it("maps a 401 response to null instead of throwing", async () => {
    const axios = await import("axios");
    const error = new axios.AxiosError("Unauthorized");
    error.response = { status: 401 } as never;
    const { service } = await loadService({
      configured: true,
      get: vi.fn().mockRejectedValue(error),
    });

    await expect(service.getCurrentUser()).resolves.toBeNull();
  });

  it("re-throws non-401 errors", async () => {
    const { service } = await loadService({
      configured: true,
      get: vi.fn().mockRejectedValue(new Error("network down")),
    });

    await expect(service.getCurrentUser()).rejects.toThrow("network down");
  });

  it("resolves to null without a request when the API is not configured", async () => {
    const { service, get } = await loadService({ configured: false });

    await expect(service.getCurrentUser()).resolves.toBeNull();
    expect(get).not.toHaveBeenCalled();
  });
});

describe("getReactionSummary", () => {
  it("returns the parsed summary on success", async () => {
    const summary = { likes: 3, dislikes: 1, userReaction: "LIKE" as const };
    const { service } = await loadService({
      configured: true,
      get: vi.fn().mockResolvedValue({ data: summary }),
    });

    await expect(service.getReactionSummary("article-1")).resolves.toEqual(summary);
  });

  it("returns the empty summary without a request when the API is not configured", async () => {
    const { service, get } = await loadService({ configured: false });

    await expect(service.getReactionSummary("article-1")).resolves.toEqual({
      likes: 0,
      dislikes: 0,
      userReaction: null,
    });
    expect(get).not.toHaveBeenCalled();
  });
});

describe("submitReaction", () => {
  it("posts the reaction type and returns the updated summary", async () => {
    const summary = { likes: 1, dislikes: 0, userReaction: "LIKE" as const };
    const { service, post } = await loadService({
      configured: true,
      post: vi.fn().mockResolvedValue({ data: summary }),
    });

    await expect(service.submitReaction("article-1", "LIKE")).resolves.toEqual(summary);
    expect(post).toHaveBeenCalledWith("/api/v1/articles/article-1/reactions", { type: "LIKE" });
  });

  it("surfaces a failed request to the caller", async () => {
    const { service } = await loadService({
      configured: true,
      post: vi.fn().mockRejectedValue(new Error("validation failed")),
    });

    await expect(service.submitReaction("article-1", "LIKE")).rejects.toThrow("validation failed");
  });
});

describe("getLoginUrl", () => {
  it("builds the LinkedIn login URL with the returnTo query param", async () => {
    const { service } = await loadService({ configured: true });

    expect(service.getLoginUrl("/articles/some-slug")).toBe(
      "http://localhost:9999/api/v1/auth/linkedin?returnTo=%2Farticles%2Fsome-slug",
    );
  });
});
