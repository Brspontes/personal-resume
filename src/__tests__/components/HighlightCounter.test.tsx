import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HighlightCounter from "@/components/HighlightCounter";

function mockMatchMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("HighlightCounter", () => {
  it("shows the final value immediately when the visitor prefers reduced motion", () => {
    mockMatchMedia(true);

    render(<HighlightCounter value={10} suffix="+" />);

    expect(screen.getByText("10+")).toBeInTheDocument();
  });

  it("starts from zero and waits to animate when motion is not reduced", () => {
    mockMatchMedia(false);

    render(<HighlightCounter value={10} suffix="+" />);

    // No IntersectionObserver entry ever reports as intersecting in jsdom,
    // so the count-up animation never starts and the display stays at 0.
    expect(screen.getByText("0+")).toBeInTheDocument();
  });

  it("renders without a suffix when none is provided", () => {
    mockMatchMedia(true);

    render(<HighlightCounter value={9} />);

    expect(screen.getByText("9")).toBeInTheDocument();
  });
});
