import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Certifications from "@/components/Certifications";

vi.mock("@/data/profile", () => ({
  profile: {
    certifications: [
      {
        id: "cert-with-link",
        name: "Certificação Verificável",
        issuer: "Emissor A",
        issuedAt: "Janeiro de 2024",
        expiresAt: "Janeiro de 2027",
        credentialUrl: "https://example.com/verify",
      },
      {
        id: "cert-without-link",
        name: "Certificação Sem Link",
        issuer: "Emissor B",
        issuedAt: "Março de 2022",
        credentialId: "ABC-123",
      },
    ],
  },
}));

describe("Certifications", () => {
  it("renders every certification's name and issuer", () => {
    render(<Certifications />);

    expect(screen.getByText("Certificação Verificável")).toBeInTheDocument();
    expect(screen.getByText("Emissor A")).toBeInTheDocument();
    expect(screen.getByText("Certificação Sem Link")).toBeInTheDocument();
    expect(screen.getByText("Emissor B")).toBeInTheDocument();
  });

  it("renders a verification link only for certifications that have a credential URL", () => {
    render(<Certifications />);

    const link = screen.getByRole("link", { name: /verificar credencial/i });
    expect(link).toHaveAttribute("href", "https://example.com/verify");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("shows the credential ID when there is no verification link", () => {
    render(<Certifications />);

    expect(screen.getByText(/ABC-123/)).toBeInTheDocument();
  });
});
