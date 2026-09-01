import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MobileNav from "@/components/MobileNav";

const mockSetActiveId = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: () => ["home", mockSetActiveId],
}));

const links = [
  { label: "Início", href: "#home", kind: "hash" as const },
  { label: "Artigos", href: "/articles", kind: "route" as const },
];

describe("MobileNav", () => {
  it("keeps the menu collapsed until the toggle button is activated", () => {
    render(<MobileNav links={links} />);

    expect(screen.getByRole("button", { name: /abrir menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("opens the menu, exposing every link, when the toggle button is clicked", () => {
    render(<MobileNav links={links} />);

    fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));

    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/#home");
    expect(screen.getByRole("link", { name: "Artigos" })).toHaveAttribute("href", "/articles");
    expect(screen.getByRole("button", { name: /fechar menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes the menu again after a link is activated", () => {
    render(<MobileNav links={links} />);

    fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));
    fireEvent.click(screen.getByRole("link", { name: "Início" }));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
