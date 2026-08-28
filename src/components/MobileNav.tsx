"use client";

import { useMemo, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

function linkClasses(isActive: boolean) {
  return `block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-zinc-100 hover:text-accent focus-visible:bg-zinc-100 focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:bg-zinc-900 ${
    isActive ? "bg-zinc-100 text-accent dark:bg-zinc-900" : "text-foreground"
  }`;
}

export default function MobileNav({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ids = useMemo(() => links.map((link) => link.href.slice(1)), [links]);
  const [activeId, setActiveId] = useActiveSection(ids);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-zinc-100 hover:text-accent focus-visible:bg-zinc-100 focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:bg-zinc-900"
      >
        <span className="sr-only">{isOpen ? "Fechar menu" : "Abrir menu"}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-6 w-6"
        >
          {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {isOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Navegação principal"
          className="absolute top-full right-0 left-0 border-t border-zinc-300 bg-background px-6 py-3 dark:border-zinc-800"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeId === id;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={linkClasses(isActive)}
                    onClick={() => {
                      setActiveId(id);
                      setIsOpen(false);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
