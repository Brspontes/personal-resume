import { profile } from "@/data/profile";

function EducationCard({
  degree,
  institution,
  period,
  isRecent,
}: {
  degree: string;
  institution: string;
  period: string;
  isRecent: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-6 transition-colors ${
        isRecent
          ? "border-accent/40 bg-accent/10"
          : "border-zinc-300 hover:border-accent/50 dark:border-zinc-700"
      }`}
    >
      <h3 className="text-lg font-semibold text-foreground">{degree}</h3>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{institution}</p>
      <p className="mt-2 font-mono text-sm text-accent">{period}</p>
    </div>
  );
}

export default function Education() {
  return (
    <section
      id="education"
      className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-accent">{"// Education"}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Formação Acadêmica
        </h2>

        <div className="mt-10 flex flex-col gap-4">
          {profile.education.map((entry, index) => (
            <EducationCard
              key={entry.degree}
              degree={entry.degree}
              institution={entry.institution}
              period={entry.period}
              isRecent={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
