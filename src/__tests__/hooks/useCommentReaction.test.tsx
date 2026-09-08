import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { useCommentReaction } from "@/hooks/useCommentReaction";
import { addOrUpdateCommentReaction, removeCommentReaction } from "@/lib/comments/service";
import type { Comment } from "@/lib/comments/types";
import type { ReactNode } from "react";

vi.mock("@/lib/comments/service", () => ({
  addOrUpdateCommentReaction: vi.fn(),
  removeCommentReaction: vi.fn(),
}));

function baseComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: "c1",
    content: "Excelente artigo!",
    author: { id: "u1", name: "Jane Doe" },
    isOwner: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    replies: [],
    likes: 0,
    dislikes: 0,
    userReaction: null,
    ...overrides,
  };
}

function renderWithClient(articleId: string, commentId: string, initialComments: Comment[]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(["comments", articleId], initialComments);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const rendered = renderHook(() => useCommentReaction(articleId, commentId), { wrapper });
  return { ...rendered, queryClient };
}

describe("useCommentReaction", () => {
  it("creates a reaction and patches the matching top-level comment in the cache", async () => {
    const updated = { likes: 1, dislikes: 0, userReaction: "LIKE" as const };
    vi.mocked(addOrUpdateCommentReaction).mockResolvedValue(updated);

    const { result, queryClient } = renderWithClient("article-1", "c1", [baseComment({ id: "c1" })]);

    act(() => result.current.react("LIKE"));

    await waitFor(() => expect(result.current.isReacting).toBe(false));
    expect(addOrUpdateCommentReaction).toHaveBeenCalledWith("c1", "LIKE");
    expect(queryClient.getQueryData<Comment[]>(["comments", "article-1"])?.[0]).toMatchObject(
      updated,
    );
  });

  it("switches a reaction by calling react again with the opposite type", async () => {
    vi.mocked(addOrUpdateCommentReaction).mockResolvedValue({
      likes: 0,
      dislikes: 1,
      userReaction: "DISLIKE",
    });

    const { result } = renderWithClient("article-1", "c1", [
      baseComment({ id: "c1", likes: 1, userReaction: "LIKE" }),
    ]);

    act(() => result.current.react("DISLIKE"));

    await waitFor(() => expect(result.current.isReacting).toBe(false));
    expect(addOrUpdateCommentReaction).toHaveBeenCalledWith("c1", "DISLIKE");
  });

  it("removes a reaction via the delete endpoint, decrementing the count locally since the backend returns no body", async () => {
    vi.mocked(removeCommentReaction).mockResolvedValue(undefined);

    const { result, queryClient } = renderWithClient("article-1", "c1", [
      baseComment({ id: "c1", likes: 1, dislikes: 0, userReaction: "LIKE" }),
    ]);

    act(() => result.current.remove());

    await waitFor(() => expect(result.current.isReacting).toBe(false));
    expect(removeCommentReaction).toHaveBeenCalledWith("c1");
    const patched = queryClient.getQueryData<Comment[]>(["comments", "article-1"])?.[0];
    expect(patched?.userReaction).toBeNull();
    expect(patched?.likes).toBe(0);
    expect(patched?.dislikes).toBe(0);
  });

  it("removes a dislike, decrementing the dislike count and not the like count", async () => {
    vi.mocked(removeCommentReaction).mockResolvedValue(undefined);

    const { result, queryClient } = renderWithClient("article-1", "c1", [
      baseComment({ id: "c1", likes: 3, dislikes: 1, userReaction: "DISLIKE" }),
    ]);

    act(() => result.current.remove());

    await waitFor(() => expect(result.current.isReacting).toBe(false));
    const patched = queryClient.getQueryData<Comment[]>(["comments", "article-1"])?.[0];
    expect(patched?.userReaction).toBeNull();
    expect(patched?.likes).toBe(3);
    expect(patched?.dislikes).toBe(0);
  });

  it("patches a reply nested under a different comment without touching siblings", async () => {
    const updated = { likes: 2, dislikes: 0, userReaction: "LIKE" as const };
    vi.mocked(addOrUpdateCommentReaction).mockResolvedValue(updated);

    const untouchedReply = baseComment({ id: "r-other", likes: 5, dislikes: 1 });
    const targetReply = baseComment({ id: "r1", likes: 1 });
    const initialComments = [
      baseComment({ id: "c1", replies: [] }),
      baseComment({ id: "c2", replies: [targetReply, untouchedReply] }),
    ];

    const { result, queryClient } = renderWithClient("article-1", "r1", initialComments);

    act(() => result.current.react("LIKE"));

    await waitFor(() => expect(result.current.isReacting).toBe(false));

    const cached = queryClient.getQueryData<Comment[]>(["comments", "article-1"]);
    expect(cached?.[0]).toEqual(initialComments[0]);
    expect(cached?.[1].replies[0]).toMatchObject(updated);
    expect(cached?.[1].replies[1]).toEqual(untouchedReply);
  });

  it("clears the current-user cache on a 401", async () => {
    const error = new axios.AxiosError("Unauthorized");
    error.response = { status: 401 } as never;
    vi.mocked(addOrUpdateCommentReaction).mockRejectedValue(error);

    const { result, queryClient } = renderWithClient("article-1", "c1", [baseComment({ id: "c1" })]);

    act(() => result.current.react("LIKE"));

    await waitFor(() => expect(result.current.reactionError).not.toBeNull());
    expect(queryClient.getQueryData(["currentUser"])).toBeNull();
  });
});
