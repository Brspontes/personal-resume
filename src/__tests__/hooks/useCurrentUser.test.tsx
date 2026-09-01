import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCurrentUser } from "@/lib/reactions/service";
import type { ReactNode } from "react";

vi.mock("@/lib/reactions/service", () => ({
  getCurrentUser: vi.fn(),
  getLoginUrl: vi.fn((returnTo: string) => `http://localhost:9999/login?returnTo=${returnTo}`),
}));

function renderWithClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useCurrentUser(), { wrapper });
}

describe("useCurrentUser", () => {
  it("starts in the loading state", () => {
    vi.mocked(getCurrentUser).mockReturnValue(new Promise(() => {}));

    const { result } = renderWithClient();

    expect(result.current.status).toBe("loading");
    expect(result.current.user).toBeNull();
  });

  it("resolves to authenticated with the user on success", async () => {
    const user = { id: "1", name: "Jane Doe" };
    vi.mocked(getCurrentUser).mockResolvedValue(user);

    const { result } = renderWithClient();

    await waitFor(() => expect(result.current.status).toBe("authenticated"));
    expect(result.current.user).toEqual(user);
  });

  it("resolves to unauthenticated when there is no user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const { result } = renderWithClient();

    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));
    expect(result.current.user).toBeNull();
  });

  it("exposes getLoginUrl from the service", () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const { result } = renderWithClient();

    expect(result.current.getLoginUrl("/articles/some-slug")).toBe(
      "http://localhost:9999/login?returnTo=/articles/some-slug",
    );
  });
});
