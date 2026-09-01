import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/useCommentMutations";
import { createComment, deleteComment, updateComment } from "@/lib/comments/service";
import type { ReactNode } from "react";

vi.mock("@/lib/comments/service", () => ({
  createComment: vi.fn(),
  updateComment: vi.fn(),
  deleteComment: vi.fn(),
}));

function makeAxiosError(status: number) {
  const error = new axios.AxiosError("request failed");
  error.response = { status } as never;
  return error;
}

function renderWithClient<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const rendered = renderHook(hook, { wrapper });
  return { ...rendered, queryClient, invalidateSpy };
}

describe("useCreateComment", () => {
  it("invalidates the article's comments query on success", async () => {
    vi.mocked(createComment).mockResolvedValue({
      id: "c1",
      content: "Oi",
      author: { id: "u1", name: "Jane" },
      isOwner: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      deletedAt: null,
      replies: [],
    });
    const { result, invalidateSpy } = renderWithClient(() => useCreateComment("article-1"));

    act(() => result.current.mutate({ content: "Oi" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["comments", "article-1"] });
  });

  it("clears the current-user cache on a 401", async () => {
    vi.mocked(createComment).mockRejectedValue(makeAxiosError(401));
    const { result, queryClient } = renderWithClient(() => useCreateComment("article-1"));

    act(() => result.current.mutate({ content: "Oi" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryClient.getQueryData(["currentUser"])).toBeNull();
  });
});

describe("useUpdateComment", () => {
  it("invalidates comments on success", async () => {
    vi.mocked(updateComment).mockResolvedValue({
      id: "c1",
      content: "Editado",
      author: { id: "u1", name: "Jane" },
      isOwner: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      deletedAt: null,
      replies: [],
    });
    const { result, invalidateSpy } = renderWithClient(() => useUpdateComment("article-1"));

    act(() => result.current.mutate({ commentId: "c1", content: "Editado" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["comments", "article-1"] });
  });

  it("reconciles comments on a 403 (no longer owned)", async () => {
    vi.mocked(updateComment).mockRejectedValue(makeAxiosError(403));
    const { result, invalidateSpy } = renderWithClient(() => useUpdateComment("article-1"));

    act(() => result.current.mutate({ commentId: "c1", content: "Editado" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["comments", "article-1"] });
  });
});

describe("useDeleteComment", () => {
  it("invalidates comments on success", async () => {
    vi.mocked(deleteComment).mockResolvedValue(undefined);
    const { result, invalidateSpy } = renderWithClient(() => useDeleteComment("article-1"));

    act(() => result.current.mutate("c1"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["comments", "article-1"] });
  });
});
