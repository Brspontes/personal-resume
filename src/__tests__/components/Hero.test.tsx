import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Hero from "@/components/Hero";

const { profileFixture } = vi.hoisted(() => ({
  profileFixture: {
    name: "Fulano de Tal",
    role: "Tech Lead",
    headline: "Full Stack Developer",
    summary: "Engenheiro com experiência em Node.js e TypeScript, sempre estudando novas tecnologias.",
    techStack: ["Node.js", "TypeScript", "React"],
  },
}));

vi.mock("@/data/profile", () => ({
  profile: profileFixture,
}));

describe("Hero", () => {
  it("renders the profile name as the main heading", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1, name: profileFixture.name })).toBeInTheDocument();
  });

  it("renders the role and headline", () => {
    render(<Hero />);

    expect(screen.getByText(profileFixture.role, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`{ ${profileFixture.headline} }`)).toBeInTheDocument();
  });

  it("renders the full summary, including the highlighted keywords", () => {
    render(<Hero />);

    const summaryParagraph = screen.getByText(
      (_, element) => element?.tagName.toLowerCase() === "p" && element.textContent === profileFixture.summary,
    );
    expect(summaryParagraph).toBeInTheDocument();
    // Scoped to the summary paragraph: these keywords also appear again in
    // the tech stack list below it.
    expect(within(summaryParagraph).getByText("Node.js")).toBeInTheDocument();
    expect(within(summaryParagraph).getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders every tech stack item", () => {
    render(<Hero />);

    // Scoped to `listitem`s: some tech names (e.g. "Node.js") also appear as
    // highlighted keywords inside the summary paragraph.
    const items = screen.getAllByRole("listitem").map((item) => item.textContent);
    for (const tech of profileFixture.techStack) {
      expect(items).toContain(tech);
    }
  });

  it("renders the experience CTA and the CV download link", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: /ver_experiencia/i })).toHaveAttribute(
      "href",
      "#experience",
    );

    const downloadLink = screen.getByRole("link", { name: /baixar_cv/i });
    expect(downloadLink).toHaveAttribute("href", "/cv.pdf");
    expect(downloadLink).toHaveAttribute("download");
  });

  it("renders the profile photo with the profile name as its alt text", () => {
    render(<Hero />);

    expect(screen.getByAltText(profileFixture.name)).toBeInTheDocument();
  });
});
