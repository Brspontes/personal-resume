import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Contact from "@/components/Contact";

vi.mock("@/data/profile", () => ({
  profile: {
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

describe("Contact", () => {
  it("renders a mailto link with the contact email", () => {
    render(<Contact />);

    const emailLink = screen.getByRole("link", { name: "contato@example.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:contato@example.com");
  });

  it("renders each contact channel as an external link", () => {
    render(<Contact />);

    const channelLink = screen.getByRole("link", { name: "linkedin.com/in/example" });
    expect(channelLink).toHaveAttribute("href", "https://www.linkedin.com/in/example");
    expect(channelLink).toHaveAttribute("target", "_blank");
    expect(channelLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the section heading", () => {
    render(<Contact />);

    expect(screen.getByRole("heading", { name: "Vamos conversar?" })).toBeInTheDocument();
  });
});
