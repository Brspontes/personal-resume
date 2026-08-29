import Link from "next/link";
import { profile } from "@/data/profile";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const NAV_LINKS: { label: string; href: string; kind: "hash" | "route" }[] = [
  { label: "Início", href: "#home", kind: "hash" },
  { label: "Destaques", href: "#highlights", kind: "hash" },
  { label: "Experiência", href: "#experience", kind: "hash" },
  { label: "Habilidades", href: "#skills", kind: "hash" },
  { label: "Educação", href: "#education", kind: "hash" },
  { label: "Certificações", href: "#certifications", kind: "hash" },
  { label: "Contato", href: "#contact", kind: "hash" },
  { label: "Artigos", href: "/articles", kind: "route" },
];

export default function Header() {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-300 bg-background/80 backdrop-blur dark:border-zinc-800">
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link
          href="/#home"
          className="flex items-center gap-2 rounded-md font-mono text-sm font-semibold text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-xs font-semibold text-white">
            {initials}
          </span>
          {profile.name}
        </Link>

        <DesktopNav links={NAV_LINKS} />

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
