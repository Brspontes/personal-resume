import { describe, expect, it, vi, beforeEach } from "vitest";

// Mirrors the reactions service test pattern: `reactionsApiBaseUrl` is read
// once at module-load time in `http.ts`, so each test resets modules and
// re-mocks `@/lib/backend/http` before dynamically importing `service.ts`.
beforeEach(() => {
  vi.resetModules();
});

async function loadService(options: {
  configured: boolean;
  get?: ReturnType<typeof vi.fn>;
  post?: ReturnType<typeof vi.fn>;
  patch?: ReturnType<typeof vi.fn>;
  delete?: ReturnType<typeof vi.fn>;
}) {
  const get = options.get ?? vi.fn();
  const post = options.post ?? vi.fn();
  const patch = options.patch ?? vi.fn();
  const del = options.delete ?? vi.fn();

  vi.doMock("@/lib/backend/http", () => ({
    http: { get, post, patch, delete: del },
    reactionsApiBaseUrl: options.configured ? "http://localhost:9999" : undefined,
  }));

  const service = await import("@/lib/comments/service");
  return { service, get, post, patch, delete: del };
}

const baseComment = {
  id: "c1",
  content: "Excelente artigo!",
  author: { id: "u1", name: "Jane Doe" },
  isOwner: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  deletedAt: null,
  replies: [],
};

describe("getComments", () => {
  it("returns the parsed comment list on success", async () => {
    const { service } = await loadService({
      configured: true,
      get: vi.fn().mockResolvedValue({ data: [baseComment] }),
    });

    await expect(service.getComments("article-1")).resolves.toEqual([baseComment]);
  });

  it("returns an empty array without a request when the API is not configured", async () => {
    const { service, get } = await loadService({ configured: false });

    await expect(service.getComments("article-1")).resolves.toEqual([]);
    expect(get).not.toHaveBeenCalled();
  });
});

describe("createComment", () => {
  it("posts the content and returns the created comment", async () => {
    const { service, post } = await loadService({
      configured: true,
      post: vi.fn().mockResolvedValue({ data: baseComment }),
    });

    await expect(
      service.createComment("article-1", { content: "Excelente artigo!" }),
    ).resolves.toEqual(baseComment);
    expect(post).toHaveBeenCalledWith("/api/v1/articles/article-1/comments", {
      content: "Excelente artigo!",
    });
  });

  it("includes parentCommentId when replying", async () => {
    const { service, post } = await loadService({
      configured: true,
      post: vi.fn().mockResolvedValue({ data: baseComment }),
    });

    await service.createComment("article-1", { content: "Concordo!", parentCommentId: "c1" });

    expect(post).toHaveBeenCalledWith("/api/v1/articles/article-1/comments", {
      content: "Concordo!",
      parentCommentId: "c1",
    });
  });

  it("surfaces a failed request to the caller", async () => {
    const { service } = await loadService({
      configured: true,
      post: vi.fn().mockRejectedValue(new Error("validation failed")),
    });

    await expect(
      service.createComment("article-1", { content: "Excelente artigo!" }),
    ).rejects.toThrow("validation failed");
  });
});

describe("updateComment", () => {
  it("patches the content and returns the updated comment", async () => {
    const updated = { ...baseComment, content: "Editado" };
    const { service, patch } = await loadService({
      configured: true,
      patch: vi.fn().mockResolvedValue({ data: updated }),
    });

    await expect(service.updateComment("c1", "Editado")).resolves.toEqual(updated);
    expect(patch).toHaveBeenCalledWith("/api/v1/comments/c1", { content: "Editado" });
  });
});

describe("deleteComment", () => {
  it("calls the delete endpoint for the comment id", async () => {
    const { service, delete: del } = await loadService({
      configured: true,
      delete: vi.fn().mockResolvedValue({}),
    });

    await service.deleteComment("c1");

    expect(del).toHaveBeenCalledWith("/api/v1/comments/c1");
  });
});
