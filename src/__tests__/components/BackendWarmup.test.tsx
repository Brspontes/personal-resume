import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BackendWarmup from "@/components/BackendWarmup";
import { pingHealth } from "@/lib/backend/service";

vi.mock("@/lib/backend/service", () => ({
  pingHealth: vi.fn(),
}));

describe("BackendWarmup", () => {
  it("pings the backend health endpoint on mount and renders nothing", async () => {
    vi.mocked(pingHealth).mockResolvedValue(undefined);

    const { container } = render(<BackendWarmup />);

    await waitFor(() => expect(pingHealth).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });

  it("does not throw when the ping fails", async () => {
    vi.mocked(pingHealth).mockRejectedValue(new Error("backend is asleep"));

    render(<BackendWarmup />);

    await waitFor(() => expect(pingHealth).toHaveBeenCalledTimes(1));
  });
});
