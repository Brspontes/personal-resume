import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "@/components/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: () => ["home", vi.fn()],
}));

vi.mock("@/data/profile", () => ({
  profile: {
    name: "Ana Beatriz Souza",
  },
}));

describe("Header", () => {
  it("renders the profile name and its initials in the logo", () => {
    render(<Header />);

    expect(screen.getAllByText("Ana Beatriz Souza")).not.toHaveLength(0);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("links the logo back to the homepage", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: /Ana Beatriz Souza/ })).toHaveAttribute("href", "/#home");
  });

  it("renders the desktop navigation landmark", () => {
    render(<Header />);

    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
  });

  it("renders the mobile menu toggle button", () => {
    render(<Header />);

    expect(screen.getByRole("button", { name: /abrir menu/i })).toBeInTheDocument();
  });
});
