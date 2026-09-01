import { describe, expect, it } from "vitest";
import { formatArticleDate, formatReadingTime } from "@/lib/format";

describe("formatArticleDate", () => {
  it("formats an ISO date string as a full pt-BR date", () => {
    expect(formatArticleDate("2026-01-15T12:00:00.000Z")).toBe("15 de janeiro de 2026");
  });
});

describe("formatReadingTime", () => {
  it("appends the pt-BR reading time suffix", () => {
    expect(formatReadingTime(4)).toBe("4 min de leitura");
  });
});
