import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { useArticleComments } from "@/hooks/useArticleComments";
import { getComments } from "@/lib/comments/service";
import type { ReactNode } from "react";

vi.mock("@/lib/comments/service", () => ({
  getComments: vi.fn(),
}));

function renderWithClient(articleId: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useArticleComments(articleId), { wrapper });
}

const comments = [
  {
    id: "c1",
    content: "Excelente artigo!",
    author: { id: "u1", name: "Jane Doe" },
    isOwner: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    replies: [],
  },
];

describe("useArticleComments", () => {
  it("starts loading and reflects the fetched comment list", async () => {
    vi.mocked(getComments).mockResolvedValue(comments);

    const { result } = renderWithClient("article-1");

    expect(result.current.isLoading).toBe(true);
    expect(result.current.comments).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.comments).toEqual(comments);
  });
});
