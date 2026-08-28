"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// How long to ignore the observer's own corrections after a manual nav
// click, long enough for the triggered smooth-scroll to finish settling.
const CLICK_SUPPRESSION_MS = 1000;

export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);
  const suppressUntilRef = useRef(0);

  // Clicking a nav link already tells us exactly which section the visitor
  // wants. The browser's own smooth-scroll animation that follows takes a
  // few hundred ms to settle, and during that window the
  // IntersectionObserver below can report an intermediate section it is
  // still transiting through as active, overwriting this optimistic value
  // before the scroll finishes. Suppress the observer's corrections for a
  // short window after a manual click so it can't fight the click's intent.
  const setActiveIdFromClick = useCallback((id: string) => {
    suppressUntilRef.current = Date.now() + CLICK_SUPPRESSION_MS;
    setActiveId(id);
  }, []);

  useEffect(() => {
    // Track every section currently inside the observation band, keyed by id.
    // A single IntersectionObserver callback can batch entries for several
    // sections at once (e.g. a fast scroll jump), and the batch order is not
    // guaranteed to match document order - naively taking "the last entry
    // processed" can leave a lower section marked active even after the
    // visitor has scrolled back above it. Recomputing the topmost
    // currently-intersecting id from this set on every callback avoids that.
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        });

        if (Date.now() < suppressUntilRef.current) {
          return;
        }

        const topmost = ids.find((id) => intersecting.has(id));
        if (topmost) {
          setActiveId(topmost);
        }
      },
      { rootMargin: "-64px 0px -60% 0px", threshold: 0 },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    // A short trailing section (e.g. Contact) may never cross the
    // IntersectionObserver's band before the page hits max scroll, so it
    // would never be marked active. Force the last section once the visitor
    // reaches the bottom of the page.
    function handleScrollEnd() {
      if (Date.now() < suppressUntilRef.current) {
        return;
      }
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (scrolledToBottom) {
        setActiveId(ids[ids.length - 1]);
      }
    }

    window.addEventListener("scroll", handleScrollEnd, { passive: true });
    handleScrollEnd();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollEnd);
    };
  }, [ids]);

  return [activeId, setActiveIdFromClick] as const;
}
