import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import CommentItem from "@/components/CommentItem";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCreateComment, useDeleteComment, useUpdateComment } from "@/hooks/useCommentMutations";
import type { Comment } from "@/lib/comments/types";

vi.mock("@/hooks/useCurrentUser");
vi.mock("@/hooks/useCommentMutations");

const mockedUseCurrentUser = vi.mocked(useCurrentUser);
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

function baseComment(overrides: Partial<Comment> = {}): Comment {
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

const defaultProps = {
  articleId: "article-1",
  articleSlug: "some-slug",
  canReply: true,
  replyingToId: null,
  onStartReply: vi.fn(),
  onCancelReply: vi.fn(),
};

describe("CommentItem", () => {
  let originalLocation: Location;

  beforeEach(() => {
    mockAuth("authenticated");
    mockedUseCreateComment.mockReturnValue(baseMutation<ReturnType<typeof useCreateComment>>());
    mockedUseUpdateComment.mockReturnValue(baseMutation<ReturnType<typeof useUpdateComment>>());
    mockedUseDeleteComment.mockReturnValue(baseMutation<ReturnType<typeof useDeleteComment>>());

    originalLocation = window.location;
    Object.defineProperty(window, "location", { writable: true, value: { href: "" } });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", { writable: true, value: originalLocation });
  });

  it("renders the author name, content, and nested replies", () => {
    const comment = baseComment({
      replies: [baseComment({ id: "r1", content: "Concordo!", author: { id: "a2", name: "Ana" } })],
    });

    render(<CommentItem comment={comment} {...defaultProps} />);

    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Excelente artigo!")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Concordo!")).toBeInTheDocument();
  });

  it("shows a deleted placeholder when a deleted comment still has replies, preserving thread history", () => {
    const comment = baseComment({
      content: null,
      deletedAt: "2026-01-02T00:00:00.000Z",
      replies: [baseComment({ id: "r1", content: "Concordo!", author: { id: "a2", name: "Ana" } })],
    });

    render(<CommentItem comment={comment} {...defaultProps} />);

    expect(screen.getByText("Comentário removido.")).toBeInTheDocument();
    expect(screen.queryByText("Excelente artigo!")).not.toBeInTheDocument();
    expect(screen.getByText("Concordo!")).toBeInTheDocument();
  });

  it("renders nothing for a deleted top-level comment with no replies", () => {
    const comment = baseComment({ content: null, deletedAt: "2026-01-02T00:00:00.000Z", replies: [] });

    const { container } = render(<CommentItem comment={comment} {...defaultProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a deleted top-level comment whose replies are all also deleted", () => {
    const comment = baseComment({
      content: null,
      deletedAt: "2026-01-02T00:00:00.000Z",
      replies: [
        baseComment({
          id: "r1",
          content: null,
          deletedAt: "2026-01-02T00:00:00.000Z",
          author: { id: "a2", name: "Ana" },
        }),
      ],
    });

    const { container } = render(<CommentItem comment={comment} {...defaultProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a deleted reply (replies never show a removed placeholder)", () => {
    const comment = baseComment({
      replies: [
        baseComment({
          id: "r1",
          content: null,
          deletedAt: "2026-01-02T00:00:00.000Z",
          author: { id: "a2", name: "Ana" },
        }),
      ],
    });

    render(<CommentItem comment={comment} {...defaultProps} />);

    expect(screen.queryByText("Comentário removido.")).not.toBeInTheDocument();
    expect(screen.queryByText("Ana")).not.toBeInTheDocument();
  });

  it("shows Edit and Delete only when isOwner is true", () => {
    const { rerender } = render(
      <CommentItem comment={baseComment({ isOwner: false })} {...defaultProps} />,
    );
    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
    expect(screen.queryByText("Excluir")).not.toBeInTheDocument();

    rerender(<CommentItem comment={baseComment({ isOwner: true })} {...defaultProps} />);
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("hides the reply action when canReply is false", () => {
    render(<CommentItem comment={baseComment()} {...defaultProps} canReply={false} />);

    expect(screen.queryByText("Responder")).not.toBeInTheDocument();
  });

  it("redirects an unauthenticated visitor to login when Responder is clicked", () => {
    mockAuth("unauthenticated");
    const onStartReply = vi.fn();

    render(<CommentItem comment={baseComment()} {...defaultProps} onStartReply={onStartReply} />);
    fireEvent.click(screen.getByText("Responder"));

    expect(onStartReply).not.toHaveBeenCalled();
    expect(window.location.href).toBe("http://localhost:9999/login?returnTo=/articles/some-slug");
  });

  it("submits updated content through useUpdateComment when editing", async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    mockedUseUpdateComment.mockReturnValue(baseMutation<ReturnType<typeof useUpdateComment>>({ mutateAsync }));

    render(<CommentItem comment={baseComment({ isOwner: true })} {...defaultProps} />);
    fireEvent.click(screen.getByText("Editar"));

    const textarea = screen.getByDisplayValue("Excelente artigo!");
    fireEvent.change(textarea, { target: { value: "Editado!" } });
    fireEvent.click(screen.getByText("Salvar"));

    expect(mutateAsync).toHaveBeenCalledWith({ commentId: "c1", content: "Editado!" });
  });

  it("requires confirmation before calling the delete mutation", () => {
    const mutate = vi.fn();
    mockedUseDeleteComment.mockReturnValue(baseMutation<ReturnType<typeof useDeleteComment>>({ mutate }));

    render(<CommentItem comment={baseComment({ isOwner: true })} {...defaultProps} />);
    fireEvent.click(screen.getByText("Excluir"));

    expect(mutate).not.toHaveBeenCalled();
    expect(screen.getByText("Excluir este comentário?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirmar"));
    expect(mutate).toHaveBeenCalledWith("c1");
  });
});
