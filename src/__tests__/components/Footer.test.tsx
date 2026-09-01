import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Footer from "@/components/Footer";

vi.mock("@/data/profile", () => ({
  profile: {
    name: "Fulano de Tal",
    role: "Tech Lead",
    contact: {
      email: "contato@example.com",
      channels: [
        {
          label: "LinkedIn",
          value: "linkedin.com/in/example",
          href: "https://www.linkedin.com/in/example",
        },
      ],
    },
  },
}));

describe("Footer", () => {
  it("renders the profile name and role", () => {
    render(<Footer />);

    expect(screen.getByText("Fulano de Tal")).toBeInTheDocument();
    expect(screen.getByText("Tech Lead")).toBeInTheDocument();
  });

  it("renders a mailto link with the contact email", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "contato@example.com" })).toHaveAttribute(
      "href",
      "mailto:contato@example.com",
    );
  });

  it("renders each channel using its label as the link text", () => {
    render(<Footer />);

    const channelLink = screen.getByRole("link", { name: "LinkedIn" });
    expect(channelLink).toHaveAttribute("href", "https://www.linkedin.com/in/example");
    expect(channelLink).toHaveAttribute("target", "_blank");
  });

  it("renders the current year in the copyright line", () => {
    render(<Footer />);

    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
  });
});
