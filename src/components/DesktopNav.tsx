"use client";

import { useMemo } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

export default function DesktopNav({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const ids = useMemo(() => links.map((link) => link.href.slice(1)), [links]);
  const [activeId, setActiveId] = useActiveSection(ids);

  return (
    <nav aria-label="Navegação principal" className="hidden sm:block">
      <ul className="flex items-center gap-6">
        {links.map((link) => {
          const id = link.href.slice(1);
          const isActive = activeId === id;

          return (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveId(id)}
                className={`font-mono text-sm transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive ? "text-accent" : "text-foreground"
                }`}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
