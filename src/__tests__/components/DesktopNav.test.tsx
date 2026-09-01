import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DesktopNav from "@/components/DesktopNav";

const mockSetActiveId = vi.fn();
let mockPathname = "/";
let mockActiveId = "home";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: () => [mockActiveId, mockSetActiveId],
}));

const links = [
  { label: "Início", href: "#home", kind: "hash" as const },
  { label: "Experiência", href: "#experience", kind: "hash" as const },
  { label: "Artigos", href: "/articles", kind: "route" as const },
];

describe("DesktopNav", () => {
  it("renders hash links pointing to the home page fragment", () => {
    mockPathname = "/";
    mockActiveId = "home";
    render(<DesktopNav links={links} />);

    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/#home");
    expect(screen.getByRole("link", { name: "Experiência" })).toHaveAttribute("href", "/#experience");
  });

  it("renders route links pointing directly to their route", () => {
    mockPathname = "/";
    mockActiveId = "home";
    render(<DesktopNav links={links} />);

    expect(screen.getByRole("link", { name: "Artigos" })).toHaveAttribute("href", "/articles");
  });

  it("marks the hash link matching the active section as current, on the homepage", () => {
    mockPathname = "/";
    mockActiveId = "experience";
    render(<DesktopNav links={links} />);

    expect(screen.getByRole("link", { name: "Experiência" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "Início" })).not.toHaveAttribute("aria-current");
  });

  it("does not mark any hash link as current when not on the homepage", () => {
    mockPathname = "/articles";
    mockActiveId = "home";
    render(<DesktopNav links={links} />);

    expect(screen.getByRole("link", { name: "Início" })).not.toHaveAttribute("aria-current");
  });

  it("marks the route link as current when the pathname matches it", () => {
    mockPathname = "/articles";
    mockActiveId = "home";
    render(<DesktopNav links={links} />);

    expect(screen.getByRole("link", { name: "Artigos" })).toHaveAttribute("aria-current", "true");
  });
});
