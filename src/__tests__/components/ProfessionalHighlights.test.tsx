import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfessionalHighlights from "@/components/ProfessionalHighlights";

vi.mock("@/data/profile", () => ({
  profile: {
    highlights: [
      { value: 10, suffix: "+", label: "Anos de Experiência" },
      { value: 9, label: "Empresas" },
    ],
  },
}));

vi.mock("@/components/HighlightCounter", () => ({
  default: ({ value, suffix }: { value: number; suffix?: string }) => (
    <span>
      {value}
      {suffix}
    </span>
  ),
}));

describe("ProfessionalHighlights", () => {
  it("renders every highlight's value, suffix, and label", () => {
    const { container } = render(<ProfessionalHighlights />);

    expect(screen.getByText("10+")).toBeInTheDocument();
    expect(screen.getByText("Anos de Experiência")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("Empresas")).toBeInTheDocument();
    expect(container.querySelector("#highlights")).toBeInTheDocument();
  });
});
