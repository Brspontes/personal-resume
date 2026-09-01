import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExperienceNavigator from "@/components/ExperienceNavigator";
import type { ExperienceEntry } from "@/data/profile";

const experiences: ExperienceEntry[] = [
  {
    company: "Empresa A",
    role: "Tech Lead",
    period: "2024 — Atual",
    location: "São Paulo",
    current: true,
    description: "Descrição da experiência A.",
    responsibilities: ["Responsabilidade A1", "Responsabilidade A2"],
    technologies: ["Kotlin", "AWS"],
    positions: [
      { role: "Tech Lead", period: "2025 — Atual" },
      { role: "Senior Engineer", period: "2024 — 2025" },
    ],
  },
  {
    company: "Empresa B",
    role: "Engenheiro",
    period: "2022 — 2024",
    responsibilities: ["Responsabilidade B1"],
  },
];

describe("ExperienceNavigator", () => {
  it("shows the first experience's details by default", () => {
    render(<ExperienceNavigator experiences={experiences} />);

    expect(screen.getByRole("heading", { level: 3, name: "Tech Lead" })).toBeInTheDocument();
    expect(screen.getByText("Descrição da experiência A.")).toBeInTheDocument();
    expect(screen.getByText("Responsabilidade A1")).toBeInTheDocument();
    expect(screen.getByText("Kotlin")).toBeInTheDocument();
  });

  it("shows a multi-position timeline when the entry has more than one position", () => {
    render(<ExperienceNavigator experiences={experiences} />);

    expect(screen.getByText("2025 — Atual")).toBeInTheDocument();
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
  });

  it("marks only the current company with the current-role indicator", () => {
    render(<ExperienceNavigator experiences={experiences} />);

    expect(screen.getByText("● atual")).toBeInTheDocument();
  });

  it("falls back to initials when a company has no logo", () => {
    render(<ExperienceNavigator experiences={experiences} />);

    // Neither fixture company has a `logo`, so both nav buttons fall back to
    // the first two letters of the company name ("Empresa A"/"Empresa B" -> "EM").
    expect(screen.getAllByText("EM")).toHaveLength(2);
  });

  it("switches the displayed details when a different company is selected", () => {
    render(<ExperienceNavigator experiences={experiences} />);

    fireEvent.click(screen.getByRole("button", { name: /Empresa B/ }));

    expect(screen.getByRole("heading", { level: 3, name: "Engenheiro" })).toBeInTheDocument();
    expect(screen.getByText("Responsabilidade B1")).toBeInTheDocument();
    expect(screen.queryByText("// Tecnologias")).not.toBeInTheDocument();
  });
});
