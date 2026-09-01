import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfessionalExperience from "@/components/ProfessionalExperience";

const { fixtureExperiences } = vi.hoisted(() => ({
  fixtureExperiences: [
    { company: "Empresa A", role: "Tech Lead", period: "2024 — Atual", responsibilities: [] },
    { company: "Empresa B", role: "Engenheiro", period: "2022 — 2024", responsibilities: [] },
  ],
}));

vi.mock("@/data/profile", () => ({
  profile: { experiences: fixtureExperiences },
}));

vi.mock("@/components/ExperienceNavigator", () => ({
  default: ({ experiences }: { experiences: unknown[] }) => (
    <div data-testid="experience-navigator-stub">{experiences.length} experiências</div>
  ),
}));

describe("ProfessionalExperience", () => {
  it("renders the section heading and id", () => {
    const { container } = render(<ProfessionalExperience />);

    expect(screen.getByRole("heading", { name: "Experiência Profissional" })).toBeInTheDocument();
    expect(container.querySelector("#experience")).toBeInTheDocument();
  });

  it("passes the profile's experiences through to the navigator", () => {
    render(<ProfessionalExperience />);

    expect(screen.getByTestId("experience-navigator-stub")).toHaveTextContent("2 experiências");
  });
});
