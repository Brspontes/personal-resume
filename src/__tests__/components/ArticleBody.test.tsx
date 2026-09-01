import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ArticleBody from "@/components/ArticleBody";
import type { PortableTextContent } from "@/lib/sanity/types";

vi.mock("@/lib/sanity/image", () => ({
  urlForImage: () => ({
    width: () => ({
      fit: () => ({
        url: () => "https://cdn.sanity.io/test-image.jpg",
      }),
    }),
  }),
}));

describe("ArticleBody", () => {
  it("renders headings, paragraphs, and images from the portable text body", () => {
    const body: PortableTextContent = [
      {
        _type: "block",
        _key: "b1",
        style: "h2",
        children: [{ _type: "span", _key: "s1", text: "Título da seção" }],
      },
      {
        _type: "block",
        _key: "b2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "Parágrafo normal." }],
      },
      {
        _type: "image",
        _key: "b3",
        alt: "Diagrama da arquitetura",
        asset: { _ref: "image-abc", _type: "reference" },
      },
    ];

    render(<ArticleBody value={body} />);

    expect(screen.getByRole("heading", { level: 2, name: "Título da seção" })).toBeInTheDocument();
    expect(screen.getByText("Parágrafo normal.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Diagrama da arquitetura" })).toHaveAttribute(
      "src",
      expect.stringContaining("test-image.jpg"),
    );
  });

  it("renders the rest of the content when a block type is not explicitly supported", () => {
    const body: PortableTextContent = [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Antes do bloco desconhecido." }],
      },
      { _type: "somethingUnsupported", _key: "b2" },
      {
        _type: "block",
        _key: "b3",
        style: "normal",
        children: [{ _type: "span", _key: "s3", text: "Depois do bloco desconhecido." }],
      },
    ];

    render(<ArticleBody value={body} />);

    expect(screen.getByText("Antes do bloco desconhecido.")).toBeInTheDocument();
    expect(screen.getByText("Depois do bloco desconhecido.")).toBeInTheDocument();
  });
});
