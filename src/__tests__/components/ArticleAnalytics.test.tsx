import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ArticleAnalytics from "@/components/ArticleAnalytics";
import { useArticleAnalytics } from "@/hooks/useArticleAnalytics";

vi.mock("@/hooks/useArticleAnalytics", () => ({
  useArticleAnalytics: vi.fn(),
}));

describe("ArticleAnalytics", () => {
  it("renders nothing and invokes the tracking hook with the given articleId", () => {
    const { container } = render(<ArticleAnalytics articleId="article-1" />);

    expect(container).toBeEmptyDOMElement();
    expect(useArticleAnalytics).toHaveBeenCalledWith("article-1");
  });
});
