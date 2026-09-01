import { describe, expect, it, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

async function loadService(options: { configured: boolean; get?: ReturnType<typeof vi.fn> }) {
  const get = options.get ?? vi.fn().mockResolvedValue({ data: { status: "ok" } });

  vi.doMock("@/lib/backend/http", () => ({
    http: { get },
    reactionsApiBaseUrl: options.configured ? "http://localhost:9999" : undefined,
  }));

  const service = await import("@/lib/backend/service");
  return { service, get };
}

describe("pingHealth", () => {
  it("calls the health endpoint when configured", async () => {
    const { service, get } = await loadService({ configured: true });

    await service.pingHealth();

    expect(get).toHaveBeenCalledWith("/api/v1/health");
  });

  it("does nothing when the API is not configured", async () => {
    const { service, get } = await loadService({ configured: false });

    await service.pingHealth();

    expect(get).not.toHaveBeenCalled();
  });
});
