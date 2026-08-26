"use client";

import { useState } from "react";
import Image from "next/image";
import type { ExperienceEntry } from "@/data/profile";

function CompanyLogo({ company, logo }: { company: string; logo?: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/90 p-1.5">
      {logo ? (
        <Image
          src={logo}
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="font-mono text-xs font-semibold text-zinc-700">
          {company.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function ExperienceNavigator({
  experiences,
}: {
  experiences: ExperienceEntry[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = experiences[selectedIndex];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
      <nav
        aria-label="Empresas"
        className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {experiences.map((experience, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={experience.company}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors lg:shrink ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-zinc-300 hover:border-accent/50 dark:border-zinc-700"
              }`}
            >
              <CompanyLogo company={experience.company} logo={experience.logo} />
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-sm font-medium text-foreground">
                  {experience.company}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {experience.role}
                </span>
                {experience.current && (
                  <span className="font-mono text-[0.65rem] tracking-wide text-accent uppercase">
                    {"● atual"}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="min-w-0">
        <h3 className="text-2xl font-semibold text-foreground">
          {selected.role}
        </h3>
        <p className="mt-1 font-mono text-accent">{selected.company}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {selected.period}
          {selected.location ? ` · ${selected.location}` : ""}
        </p>

        {selected.positions && selected.positions.length > 1 && (
          <ol className="mt-4 space-y-2 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700">
            {selected.positions.map((position) => (
              <li key={`${position.role}-${position.period}`}>
                <p className="text-sm font-medium text-foreground">
                  {position.role}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {position.period}
                </p>
              </li>
            ))}
          </ol>
        )}

        {selected.description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {selected.description}
          </p>
        )}

        <div className="mt-6">
          <h4 className="font-mono text-sm text-accent">
            {"// Responsabilidades"}
          </h4>
          <ul className="mt-2 space-y-1.5">
            {selected.responsibilities.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="text-accent">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {selected.technologies && (
          <div className="mt-6">
            <h4 className="font-mono text-sm text-accent">
              {"// Tecnologias"}
            </h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {selected.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-zinc-300 px-3 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
