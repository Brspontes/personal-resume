"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";

type NavLink = { label: string; href: string; kind: "hash" | "route" };

const linkClasses = (isActive: boolean) =>
  `font-mono text-sm transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    isActive ? "text-accent" : "text-foreground"
  }`;

export default function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const ids = useMemo(
    () => links.filter((link) => link.kind === "hash").map((link) => link.href.slice(1)),
    [links],
  );
  const [activeId, setActiveId] = useActiveSection(ids);

  return (
    <nav aria-label="Navegação principal" className="hidden sm:block">
      <ul className="flex items-center gap-6">
        {links.map((link) => {
          if (link.kind === "route") {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={linkClasses(isActive)}
                >
                  {link.label}
                </Link>
              </li>
            );
          }

          const id = link.href.slice(1);
          const isHome = pathname === "/";
          const isActive = isHome && activeId === id;

          return (
            <li key={link.href}>
              {/* Always prefix with "/": on the homepage this is a same-document
                  fragment navigation (native smooth scroll), and from any other
                  route it navigates home and resolves the fragment on load. */}
              <a
                href={`/${link.href}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => isHome && setActiveId(id)}
                className={linkClasses(isActive)}
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
