"use client";

import { useEffect } from "react";
import { pingHealth } from "@/lib/backend/service";

// The reactions/comments backend is hosted on Render's free tier, which
// spins the service down after a period of inactivity and takes roughly a
// minute to spin back up. Firing a fire-and-forget health check as soon as
// a visitor reaches the articles listing gives the backend a head start
// while they're still picking (or reading) an article, so it's more likely
// to already be awake by the time they try to react or comment.
export default function BackendWarmup() {
  useEffect(() => {
    pingHealth().catch(() => {
      // Best-effort warmup ping - failures are not surfaced anywhere.
    });
  }, []);

  return null;
}
