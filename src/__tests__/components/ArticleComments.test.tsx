import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ArticleComments from "@/components/ArticleComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useArticleComments } from "@/hooks/useArticleComments";
import { useCreateComment, useDeleteComment, useUpdateComment } from "@/hooks/useCommentMutations";
import type { Comment } from "@/lib/comments/types";

vi.mock("@/hooks/useCurrentUser");
vi.mock("@/hooks/useArticleComments");
vi.mock("@/hooks/useCommentMutations");

const mockedUseCurrentUser = vi.mocked(useCurrentUser);
const mockedUseArticleComments = vi.mocked(useArticleComments);
const mockedUseCreateComment = vi.mocked(useCreateComment);
const mockedUseUpdateComment = vi.mocked(useUpdateComment);
const mockedUseDeleteComment = vi.mocked(useDeleteComment);

const loginUrl = vi.fn((returnTo: string) => `http://localhost:9999/login?returnTo=${returnTo}`);

function mockAuth(status: "loading" | "authenticated" | "unauthenticated") {
  mockedUseCurrentUser.mockReturnValue({
    status,
    user: status === "authenticated" ? { id: "u1", name: "Jane Doe" } : null,
    getLoginUrl: loginUrl,
  });
}

function baseMutation<
  T extends
    | ReturnType<typeof useCreateComment>
    | ReturnType<typeof useUpdateComment>
    | ReturnType<typeof useDeleteComment>,
>(overrides: Partial<T> = {}): T {
  return {
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as T;
}

function comment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: "c1",
    content: "Excelente artigo!",
    author: { id: "author-1", name: "John Smith" },
    isOwner: false,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
    deletedAt: null,
    replies: [],
    ...overrides,
  };
}

describe("ArticleComments", () => {
  beforeEach(() => {
    mockAuth("authenticated");
    mockedUseArticleComments.mockReturnValue({ comments: [], isLoading: false });
    mockedUseCreateComment.mockReturnValue(baseMutation<ReturnType<typeof useCreateComment>>());
    mockedUseUpdateComment.mockReturnValue(baseMutation<ReturnType<typeof useUpdateComment>>());
    mockedUseDeleteComment.mockReturnValue(baseMutation<ReturnType<typeof useDeleteComment>>());
  });

  it("renders the empty state when there are no comments", () => {
    render(<ArticleComments articleId="article-1" articleSlug="some-slug" />);

    expect(screen.getByText("Nenhum comentário ainda. Seja o primeiro a comentar.")).toBeInTheDocument();
  });

  it("authenticated visitor can submit a new top-level comment", () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    mockedUseCreateComment.mockReturnValue(baseMutation<ReturnType<typeof useCreateComment>>({ mutateAsync }));

    render(<ArticleComments articleId="article-1" articleSlug="some-slug" />);
    const textarea = screen.getByLabelText("Escreva um comentário...");
    fireEvent.change(textarea, { target: { value: "Muito bom!" } });
    fireEvent.click(screen.getByText("Comentar"));

    expect(mutateAsync).toHaveBeenCalledWith({ content: "Muito bom!" });
  });

  it("does not submit empty or whitespace-only content", () => {
    const mutateAsync = vi.fn();
    mockedUseCreateComment.mockReturnValue(baseMutation<ReturnType<typeof useCreateComment>>({ mutateAsync }));

    render(<ArticleComments articleId="article-1" articleSlug="some-slug" />);
    const submitButton = screen.getByText("Comentar");
    expect(submitButton).toBeDisabled();

    const textarea = screen.getByLabelText("Escreva um comentário...");
    fireEvent.change(textarea, { target: { value: "   " } });
    expect(submitButton).toBeDisabled();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("shows the LinkedIn sign-in prompt instead of the form when unauthenticated", () => {
    mockAuth("unauthenticated");

    render(<ArticleComments articleId="article-1" articleSlug="some-slug" />);

    expect(screen.queryByLabelText("Escreva um comentário...")).not.toBeInTheDocument();
    const loginLink = screen.getByRole("link", { name: "Faça login com o LinkedIn" });
    expect(loginLink).toHaveAttribute("href", "http://localhost:9999/login?returnTo=/articles/some-slug");
  });

  it("keeps only one reply form open at a time across multiple comments", () => {
    mockedUseArticleComments.mockReturnValue({
      comments: [comment({ id: "c1" }), comment({ id: "c2", author: { id: "a2", name: "Ana" } })],
      isLoading: false,
    });

    render(<ArticleComments articleId="article-1" articleSlug="some-slug" />);
    const replyButtons = screen.getAllByText("Responder");

    fireEvent.click(replyButtons[0]);
    expect(screen.getAllByPlaceholderText("Escreva uma resposta...")).toHaveLength(1);

    fireEvent.click(replyButtons[1]);
    expect(screen.getAllByPlaceholderText("Escreva uma resposta...")).toHaveLength(1);
  });

  it("shows a generic error message when the create-comment mutation fails, not raw error text", () => {
    mockedUseCreateComment.mockReturnValue(baseMutation<ReturnType<typeof useCreateComment>>({ isError: true }));

    render(<ArticleComments articleId="article-1" articleSlug="some-slug" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível enviar seu comentário. Tente novamente.",
    );
  });

  it("the comment form and submit control are keyboard accessible", () => {
    render(<ArticleComments articleId="article-1" articleSlug="some-slug" />);

    const textarea = screen.getByLabelText("Escreva um comentário...");
    textarea.focus();
    expect(textarea).toHaveFocus();

    const submitButton = screen.getByRole("button", { name: "Comentar" });
    expect(submitButton.tagName).toBe("BUTTON");
  });
});
