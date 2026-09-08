import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import CommentReaction from "@/components/CommentReaction";
import { markPendingLoginCheck, useCurrentUser } from "@/hooks/useCurrentUser";
import { useCommentReaction } from "@/hooks/useCommentReaction";

vi.mock("@/hooks/useCurrentUser");
vi.mock("@/hooks/useCommentReaction");

const mockedUseCurrentUser = vi.mocked(useCurrentUser);
const mockedMarkPendingLoginCheck = vi.mocked(markPendingLoginCheck);
const mockedUseCommentReaction = vi.mocked(useCommentReaction);

const loginUrl = vi.fn(
  (returnTo: string) => `http://localhost:9999/api/v1/auth/linkedin?returnTo=${returnTo}`,
);

function mockAuth(status: "loading" | "authenticated" | "unauthenticated") {
  mockedUseCurrentUser.mockReturnValue({
    status,
    user: status === "authenticated" ? { id: "u1", name: "Jane Doe" } : null,
    getLoginUrl: loginUrl,
  });
}

function mockReaction(overrides: Partial<ReturnType<typeof useCommentReaction>> = {}) {
  mockedUseCommentReaction.mockReturnValue({
    react: vi.fn(),
    remove: vi.fn(),
    isReacting: false,
    reactionError: null,
    ...overrides,
  });
}

const defaultProps = {
  articleId: "article-1",
  articleSlug: "some-slug",
  commentId: "c1",
  likes: 2,
  dislikes: 1,
  userReaction: null,
};

describe("CommentReaction", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    Object.defineProperty(window, "location", { writable: true, value: { href: "" } });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", { writable: true, value: originalLocation });
  });

  it("renders the like and dislike counts", () => {
    mockAuth("authenticated");
    mockReaction();

    render(<CommentReaction {...defaultProps} likes={5} dislikes={2} />);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows no active reaction when userReaction is null", () => {
    mockAuth("authenticated");
    mockReaction();

    render(<CommentReaction {...defaultProps} userReaction={null} />);

    expect(screen.getByRole("button", { name: "Curtir comentário" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Não curtir comentário" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows Like as active when userReaction is LIKE", () => {
    mockAuth("authenticated");
    mockReaction();

    render(<CommentReaction {...defaultProps} userReaction="LIKE" />);

    expect(screen.getByRole("button", { name: "Remover reação" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Não curtir comentário" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows Dislike as active when userReaction is DISLIKE", () => {
    mockAuth("authenticated");
    mockReaction();

    render(<CommentReaction {...defaultProps} userReaction="DISLIKE" />);

    expect(screen.getByRole("button", { name: "Curtir comentário" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Remover reação" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("clicking Like with no existing reaction calls react('LIKE')", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReaction({ react });

    render(<CommentReaction {...defaultProps} userReaction={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Curtir comentário" }));

    expect(react).toHaveBeenCalledWith("LIKE");
  });

  it("clicking Dislike with no existing reaction calls react('DISLIKE')", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReaction({ react });

    render(<CommentReaction {...defaultProps} userReaction={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Não curtir comentário" }));

    expect(react).toHaveBeenCalledWith("DISLIKE");
  });

  it("clicking the active reaction removes it", () => {
    mockAuth("authenticated");
    const remove = vi.fn();
    mockReaction({ remove });

    render(<CommentReaction {...defaultProps} userReaction="LIKE" />);
    fireEvent.click(screen.getByRole("button", { name: "Remover reação" }));

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("switching from Like to Dislike calls react('DISLIKE')", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReaction({ react });

    render(<CommentReaction {...defaultProps} userReaction="LIKE" />);
    fireEvent.click(screen.getByRole("button", { name: "Não curtir comentário" }));

    expect(react).toHaveBeenCalledWith("DISLIKE");
  });

  it("redirects an unauthenticated visitor to login instead of calling the mutation", () => {
    mockAuth("unauthenticated");
    const react = vi.fn();
    mockReaction({ react });

    render(<CommentReaction {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Curtir comentário" }));

    expect(react).not.toHaveBeenCalled();
    expect(loginUrl).toHaveBeenCalledWith("/articles/some-slug");
    expect(window.location.href).toBe(
      "http://localhost:9999/api/v1/auth/linkedin?returnTo=/articles/some-slug",
    );
    expect(mockedMarkPendingLoginCheck).toHaveBeenCalledTimes(1);
  });

  it("disables the controls while a reaction request is in flight", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReaction({ isReacting: true, react });

    render(<CommentReaction {...defaultProps} />);
    const likeButton = screen.getByRole("button", { name: "Curtir comentário" });
    expect(likeButton).toBeDisabled();

    fireEvent.click(likeButton);
    expect(react).not.toHaveBeenCalled();
  });

  it("shows a generic error message when the reaction request fails", () => {
    mockAuth("authenticated");
    mockReaction({ reactionError: new Error("Request failed with status code 500") });

    render(<CommentReaction {...defaultProps} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível registrar sua reação. Tente novamente.",
    );
    expect(screen.queryByText(/500/)).not.toBeInTheDocument();
  });

  it("works identically when rendered for a reply (same component, different commentId)", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReaction({ react });

    render(<CommentReaction {...defaultProps} commentId="reply-1" userReaction={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Curtir comentário" }));

    expect(react).toHaveBeenCalledWith("LIKE");
  });

  it("is operable via keyboard and has accessible names", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReaction({ react });

    render(<CommentReaction {...defaultProps} />);
    const dislikeButton = screen.getByRole("button", { name: "Não curtir comentário" });

    dislikeButton.focus();
    expect(dislikeButton).toHaveFocus();
    fireEvent.click(dislikeButton);

    expect(react).toHaveBeenCalledWith("DISLIKE");
  });
});
