import { http, reactionsApiBaseUrl } from "./http";

export async function pingHealth(): Promise<void> {
  if (!reactionsApiBaseUrl) {
    return;
  }

  await http.get("/api/v1/health");
}
