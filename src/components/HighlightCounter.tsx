"use client";

import { useEffect, useRef, useState } from "react";

const ANIMATION_DURATION_MS = 1200;

export default function HighlightCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [displayValue, setDisplayValue] = useState(() =>
    prefersReducedMotion ? value : 0,
  );
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / ANIMATION_DURATION_MS, 1);
          setDisplayValue(Math.round(progress * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, prefersReducedMotion]);

  return (
    <span
      ref={ref}
      className="font-mono text-4xl font-semibold text-accent sm:text-5xl"
    >
      {displayValue}
      {suffix}
    </span>
  );
}
