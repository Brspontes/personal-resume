import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticleCard from "@/components/ArticleCard";
import type { ArticleSummary } from "@/lib/sanity/types";

const baseArticle: ArticleSummary = {
  _id: "1",
  title: "Além do Copy-Paste",
  slug: "alem-do-copy-paste",
  excerpt: "Copiar o que funciona é rápido, mas questionar o legado gera valor real.",
  publishedAt: "2026-08-29T12:00:00.000Z",
  featured: false,
};

describe("ArticleCard", () => {
  it("renders the title, excerpt, and a link to the article page", () => {
    render(<ArticleCard article={baseArticle} />);

    expect(screen.getByText(baseArticle.title)).toBeInTheDocument();
    expect(screen.getByText(baseArticle.excerpt)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/articles/alem-do-copy-paste");
  });

  it("renders without a broken image when there is no cover image", () => {
    render(<ArticleCard article={baseArticle} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows a featured badge for featured articles", () => {
    render(<ArticleCard article={{ ...baseArticle, featured: true }} />);

    expect(screen.getByText("Destaque")).toBeInTheDocument();
  });

  it("does not show a featured badge for non-featured articles", () => {
    render(<ArticleCard article={baseArticle} />);

    expect(screen.queryByText("Destaque")).not.toBeInTheDocument();
  });
});
