import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import ArticleReactions from "@/components/ArticleReactions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useArticleReactions } from "@/hooks/useArticleReactions";

vi.mock("@/hooks/useCurrentUser");
vi.mock("@/hooks/useArticleReactions");

const mockedUseCurrentUser = vi.mocked(useCurrentUser);
const mockedUseArticleReactions = vi.mocked(useArticleReactions);

const loginUrl = vi.fn((returnTo: string) => `http://localhost:9999/api/v1/auth/linkedin?returnTo=${returnTo}`);

function mockAuth(status: "loading" | "authenticated" | "unauthenticated") {
  mockedUseCurrentUser.mockReturnValue({
    status,
    user: status === "authenticated" ? { id: "1", name: "Jane Doe" } : null,
    getLoginUrl: loginUrl,
  });
}

function mockReactions(overrides: Partial<ReturnType<typeof useArticleReactions>> = {}) {
  mockedUseArticleReactions.mockReturnValue({
    summary: { likes: 2, dislikes: 1, userReaction: null },
    react: vi.fn(),
    isReacting: false,
    reactionError: null,
    ...overrides,
  });
}

describe("ArticleReactions", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", { writable: true, value: originalLocation });
  });

  it("renders the counts and the visitor's current reaction from the summary", () => {
    mockAuth("authenticated");
    mockReactions({ summary: { likes: 5, dislikes: 2, userReaction: "LIKE" } });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remover curtida" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Não curtir artigo" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("authenticated visitor can Like an article with no prior reaction", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReactions({ react });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);
    fireEvent.click(screen.getByRole("button", { name: "Curtir artigo" }));

    expect(react).toHaveBeenCalledWith("LIKE");
  });

  it("authenticated visitor can switch from Like to Dislike, never showing both as active", () => {
    mockAuth("authenticated");
    mockReactions({ summary: { likes: 1, dislikes: 0, userReaction: "LIKE" } });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);

    expect(screen.getByRole("button", { name: "Remover curtida" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Não curtir artigo" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("authenticated visitor can remove an active reaction by selecting it again", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReactions({ summary: { likes: 1, dislikes: 0, userReaction: "LIKE" }, react });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);
    fireEvent.click(screen.getByRole("button", { name: "Remover curtida" }));

    expect(react).toHaveBeenCalledWith("LIKE");
  });

  it("redirects an unauthenticated visitor to the login URL instead of calling the mutation", () => {
    mockAuth("unauthenticated");
    const react = vi.fn();
    mockReactions({ react });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);
    fireEvent.click(screen.getByRole("button", { name: "Curtir artigo" }));

    expect(react).not.toHaveBeenCalled();
    expect(loginUrl).toHaveBeenCalledWith("/articles/some-slug");
    expect(window.location.href).toBe(
      "http://localhost:9999/api/v1/auth/linkedin?returnTo=/articles/some-slug",
    );
  });

  it("disables the controls while a reaction request is in flight, preventing a duplicate request", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReactions({ isReacting: true, react });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);
    const likeButton = screen.getByRole("button", { name: "Curtir artigo" });
    expect(likeButton).toBeDisabled();

    fireEvent.click(likeButton);
    expect(react).not.toHaveBeenCalled();
  });

  it("disables the controls while the auth state is still loading", () => {
    mockAuth("loading");
    mockReactions();

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);

    expect(screen.getByRole("button", { name: "Curtir artigo" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Não curtir artigo" })).toBeDisabled();
  });

  it("warns an unauthenticated visitor upfront that reacting redirects to LinkedIn login", () => {
    mockAuth("unauthenticated");
    mockReactions();

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);

    expect(
      screen.getByText(/É necessário estar autenticado com o LinkedIn/),
    ).toBeInTheDocument();
  });

  it("does not show the LinkedIn login notice for an authenticated visitor", () => {
    mockAuth("authenticated");
    mockReactions();

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);

    expect(
      screen.queryByText(/É necessário estar autenticado com o LinkedIn/),
    ).not.toBeInTheDocument();
  });

  it("shows a generic error message when the reaction request fails, keeping the last confirmed summary", () => {
    mockAuth("authenticated");
    mockReactions({
      summary: { likes: 1, dislikes: 0, userReaction: null },
      reactionError: new Error("Request failed with status code 500"),
    });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível registrar sua reação. Tente novamente.",
    );
    expect(screen.queryByText(/500/)).not.toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("reaction controls have accessible names and are operable via keyboard", () => {
    mockAuth("authenticated");
    const react = vi.fn();
    mockReactions({ react });

    render(<ArticleReactions articleId="article-1" articleSlug="some-slug" />);
    const dislikeButton = screen.getByRole("button", { name: "Não curtir artigo" });

    dislikeButton.focus();
    expect(dislikeButton).toHaveFocus();
    fireEvent.click(dislikeButton);

    expect(react).toHaveBeenCalledWith("DISLIKE");
  });
});
