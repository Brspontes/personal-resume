import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Skills from "@/components/Skills";

vi.mock("@/data/profile", () => ({
  profile: {
    techStack: ["TypeScript"],
    // "TypeScript" has a known icon mapping in the component; "COBOL" does
    // not, so it exercises the text-label fallback path.
    skills: ["TypeScript", "COBOL"],
  },
}));

describe("Skills", () => {
  it("renders an icon (not a duplicated text label) for a skill with a known icon", () => {
    render(<Skills />);

    const tooltip = screen.getByText("TypeScript", { selector: '[role="tooltip"]' });
    expect(tooltip.parentElement?.querySelector("svg")).toBeInTheDocument();
    expect(screen.getAllByText("TypeScript")).toHaveLength(1);
  });

  it("falls back to a visible text label for a skill without a known icon", () => {
    render(<Skills />);

    expect(screen.getAllByText("COBOL")).toHaveLength(2);
  });

  it("visually marks tech-stack skills as primary", () => {
    render(<Skills />);

    const primaryTooltip = screen.getByText("TypeScript", { selector: '[role="tooltip"]' });
    const secondaryTooltip = screen.getByText("COBOL", { selector: '[role="tooltip"]' });

    // "border-accent/40" is the class applied only to primary (tech-stack)
    // skills; non-primary skills only have "hover:border-accent/50".
    expect(primaryTooltip.parentElement?.className).toContain("border-accent/40");
    expect(secondaryTooltip.parentElement?.className).not.toContain("border-accent/40");
  });
});
