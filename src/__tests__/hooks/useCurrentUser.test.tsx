import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { markPendingLoginCheck, useCurrentUser } from "@/hooks/useCurrentUser";
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

describe("markPendingLoginCheck", () => {
  it("stores a flag in sessionStorage for the hook to pick up after returning from login", () => {
    window.sessionStorage.clear();

    markPendingLoginCheck();

    expect(window.sessionStorage.getItem("post_login_recheck")).toBe("1");
  });
});

describe("post-login recheck", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("retries once, automatically, when the pending-login flag is set and the first check comes back unauthenticated", async () => {
    window.sessionStorage.setItem("post_login_recheck", "1");
    const user = { id: "1", name: "Jane Doe" };
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null).mockResolvedValueOnce(user);

    const { result } = renderWithClient();

    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));
    // The flag is consumed on the first (failed) check, so a later normal
    // visit never retries again.
    expect(window.sessionStorage.getItem("post_login_recheck")).toBeNull();

    await waitFor(() => expect(result.current.status).toBe("authenticated"), { timeout: 2000 });
    expect(getCurrentUser).toHaveBeenCalledTimes(2);
  });

  it("does not retry when there is no pending-login flag (a normal, non-post-login unauthenticated visit)", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const { result } = renderWithClient();

    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));

    // Give the (would-be) retry delay plenty of time to have fired if the
    // guard were missing, then confirm no second call ever happened.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(result.current.status).toBe("unauthenticated");
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it("does not retry when the first check is already authenticated", async () => {
    window.sessionStorage.setItem("post_login_recheck", "1");
    const user = { id: "1", name: "Jane Doe" };
    vi.mocked(getCurrentUser).mockResolvedValue(user);

    const { result } = renderWithClient();

    await waitFor(() => expect(result.current.status).toBe("authenticated"));
    // The flag is unused since the first check already succeeded, but it is
    // still consumed so it can't affect a later, unrelated query.
    expect(window.sessionStorage.getItem("post_login_recheck")).toBeNull();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });
});
