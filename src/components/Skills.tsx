import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiApachekafka,
  SiBootstrap,
  SiClaude,
  SiCss,
  SiDatadog,
  SiDocker,
  SiDotnet,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJquery,
  SiKotlin,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiSplunk,
  SiSpringboot,
  SiTypescript,
} from "react-icons/si";
import { profile } from "@/data/profile";

const skillIcons: Record<string, IconType> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Kotlin: SiKotlin,
  "Node.js": SiNodedotjs,
  NestJS: SiNestjs,
  "Spring Boot": SiSpringboot,
  ".NET": SiDotnet,
  React: SiReact,
  HTML5: SiHtml5,
  CSS3: SiCss,
  Bootstrap: SiBootstrap,
  jQuery: SiJquery,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  AWS: FaAws,
  Docker: SiDocker,
  Kafka: SiApachekafka,
  Jest: SiJest,
  Datadog: SiDatadog,
  Splunk: SiSplunk,
  Claude: SiClaude,
};

function SkillCard({ skill, isPrimary }: { skill: string; isPrimary: boolean }) {
  const Icon = skillIcons[skill];

  return (
    <div
      className={`group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border p-2 transition-colors ${
        isPrimary
          ? "border-accent/40 bg-accent/10"
          : "border-zinc-300 hover:border-accent/50 dark:border-zinc-700"
      }`}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className={`h-8 w-8 ${isPrimary ? "text-accent" : "text-zinc-600 dark:text-zinc-400"}`}
        />
      ) : (
        <span
          className={`text-center text-[0.65rem] leading-tight font-mono ${isPrimary ? "text-accent" : "text-zinc-600 dark:text-zinc-400"}`}
        >
          {skill}
        </span>
      )}

      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-zinc-300 bg-background px-2 py-1 text-xs whitespace-nowrap text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:border-zinc-700"
      >
        {skill}
      </span>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-accent">{"// Skills"}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Habilidades Técnicas
        </h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {profile.skills.map((skill) => (
            <SkillCard
              key={skill}
              skill={skill}
              isPrimary={profile.techStack.includes(skill)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
