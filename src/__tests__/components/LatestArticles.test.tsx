import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import LatestArticles from "@/components/LatestArticles";
import { getLatestArticles } from "@/lib/sanity/queries";
import type { ArticleSummary } from "@/lib/sanity/types";

vi.mock("@/lib/sanity/queries", () => ({
  getLatestArticles: vi.fn(),
}));

const mockedGetLatestArticles = vi.mocked(getLatestArticles);

const article = (overrides: Partial<ArticleSummary> = {}): ArticleSummary => ({
  _id: "1",
  title: "Um artigo qualquer",
  slug: "um-artigo-qualquer",
  excerpt: "Resumo do artigo.",
  publishedAt: "2026-08-29T12:00:00.000Z",
  featured: false,
  ...overrides,
});

describe("LatestArticles", () => {
  beforeEach(() => {
    mockedGetLatestArticles.mockReset();
  });

  it("renders the heading, the fetched articles, and the view-all CTA", async () => {
    mockedGetLatestArticles.mockResolvedValue([
      article({ _id: "1", title: "Artigo 1", slug: "artigo-1" }),
      article({ _id: "2", title: "Artigo 2", slug: "artigo-2" }),
    ]);

    render(await LatestArticles());

    expect(screen.getByRole("heading", { name: "Últimos artigos" })).toBeInTheDocument();
    expect(screen.getByText("Artigo 1")).toBeInTheDocument();
    expect(screen.getByText("Artigo 2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver todos os artigos/i })).toHaveAttribute(
      "href",
      "/articles",
    );
  });

  it("requests only the 3 most recent articles", async () => {
    mockedGetLatestArticles.mockResolvedValue([]);

    await LatestArticles();

    expect(mockedGetLatestArticles).toHaveBeenCalledWith(3);
  });

  it("renders nothing when there are no published articles", async () => {
    mockedGetLatestArticles.mockResolvedValue([]);

    const result = await LatestArticles();

    expect(result).toBeNull();
  });

  it("renders nothing and logs the error when the fetch fails, instead of throwing", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedGetLatestArticles.mockRejectedValue(new Error("Sanity is unreachable"));

    const result = await LatestArticles();

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
