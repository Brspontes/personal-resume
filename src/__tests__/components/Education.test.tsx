import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Education from "@/components/Education";

vi.mock("@/data/profile", () => ({
  profile: {
    education: [
      {
        degree: "MBA em Arquitetura de Software",
        institution: "Instituto A",
        period: "2021 — 2022",
      },
      {
        degree: "Bacharelado em Ciência da Computação",
        institution: "Universidade B",
        period: "2013 — 2016",
      },
    ],
  },
}));

describe("Education", () => {
  it("renders every education entry's degree, institution, and period", () => {
    render(<Education />);

    expect(screen.getByText("MBA em Arquitetura de Software")).toBeInTheDocument();
    expect(screen.getByText("Instituto A")).toBeInTheDocument();
    expect(screen.getByText("2021 — 2022")).toBeInTheDocument();

    expect(screen.getByText("Bacharelado em Ciência da Computação")).toBeInTheDocument();
    expect(screen.getByText("Universidade B")).toBeInTheDocument();
    expect(screen.getByText("2013 — 2016")).toBeInTheDocument();
  });

  it("visually distinguishes the most recent entry from the rest", () => {
    render(<Education />);

    const recentCard = screen.getByText("MBA em Arquitetura de Software").closest("div");
    const olderCard = screen.getByText("Bacharelado em Ciência da Computação").closest("div");

    // "border-accent/40" is the class applied only to the recent entry;
    // the older entry only has "hover:border-accent/50", a different string.
    expect(recentCard?.className).toContain("border-accent/40");
    expect(olderCard?.className).not.toContain("border-accent/40");
  });
});
