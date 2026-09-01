import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { useArticleReactions } from "@/hooks/useArticleReactions";
import { getReactionSummary, submitReaction } from "@/lib/reactions/service";
import type { ReactionSummary } from "@/lib/reactions/types";
import type { ReactNode } from "react";

vi.mock("@/lib/reactions/service", () => ({
  getReactionSummary: vi.fn(),
  submitReaction: vi.fn(),
}));

function renderWithClient(articleId: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useArticleReactions(articleId), { wrapper });
}

const initialSummary = { likes: 2, dislikes: 0, userReaction: null as null };

describe("useArticleReactions", () => {
  it("reflects the fetched summary", async () => {
    vi.mocked(getReactionSummary).mockResolvedValue(initialSummary);

    const { result } = renderWithClient("article-1");

    await waitFor(() => expect(result.current.summary).toEqual(initialSummary));
  });

  it("updates the cached summary from a successful mutation, without a follow-up fetch", async () => {
    vi.mocked(getReactionSummary).mockResolvedValue(initialSummary);
    const updated = { likes: 3, dislikes: 0, userReaction: "LIKE" as const };
    vi.mocked(submitReaction).mockResolvedValue(updated);

    const { result } = renderWithClient("article-1");
    await waitFor(() => expect(result.current.summary).toEqual(initialSummary));

    act(() => result.current.react("LIKE"));

    await waitFor(() => expect(result.current.summary).toEqual(updated));
    expect(getReactionSummary).toHaveBeenCalledTimes(1);
  });

  it("leaves the cached summary unchanged when the mutation fails", async () => {
    vi.mocked(getReactionSummary).mockResolvedValue(initialSummary);
    vi.mocked(submitReaction).mockRejectedValue(new Error("boom"));

    const { result } = renderWithClient("article-1");
    await waitFor(() => expect(result.current.summary).toEqual(initialSummary));

    act(() => result.current.react("LIKE"));

    await waitFor(() => expect(result.current.reactionError).not.toBeNull());
    expect(result.current.summary).toEqual(initialSummary);
  });

  it("exposes isReacting while the mutation is in flight", async () => {
    vi.mocked(getReactionSummary).mockResolvedValue(initialSummary);
    let resolveMutation!: (value: ReactionSummary) => void;
    vi.mocked(submitReaction).mockReturnValue(
      new Promise((resolve) => {
        resolveMutation = resolve;
      }),
    );

    const { result } = renderWithClient("article-1");
    await waitFor(() => expect(result.current.summary).toEqual(initialSummary));

    act(() => result.current.react("LIKE"));
    await waitFor(() => expect(result.current.isReacting).toBe(true));

    act(() => resolveMutation({ likes: 3, dislikes: 0, userReaction: "LIKE" }));
    await waitFor(() => expect(result.current.isReacting).toBe(false));
  });
});
