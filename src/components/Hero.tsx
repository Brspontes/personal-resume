import Image from "next/image";
import { profile } from "@/data/profile";

const SUMMARY_KEYWORDS = ["Node.js", "TypeScript", "C# (.NET)", "Kotlin"];

function HighlightedSummary({ text }: { text: string }) {
  const pattern = new RegExp(`(${SUMMARY_KEYWORDS.join("|")})`, "g");
  const parts = text.split(pattern);

  return (
    <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
      {parts.map((part, index) =>
        SUMMARY_KEYWORDS.includes(part) ? (
          <span key={index} className="font-mono text-accent">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-grid-pattern relative flex min-h-[85vh] items-center overflow-hidden px-6 py-20 sm:px-10 lg:px-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <p className="font-mono text-sm text-accent">{"// Olá, eu sou"}</p>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>

          <p className="text-xl font-medium text-zinc-700 dark:text-zinc-200 sm:text-2xl">
            {profile.role}{" "}
            <span className="font-mono text-accent">{`{ ${profile.headline} }`}</span>
          </p>

          <HighlightedSummary text={profile.summary} />

          <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {profile.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-zinc-300 px-3 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
              >
                {tech}
              </li>
            ))}
            <li className="px-1 py-1 font-mono text-xs text-zinc-500 dark:text-zinc-500">
              ...e mais
            </li>
          </ul>

          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <a
              href="#experience"
              className="flex h-12 items-center justify-center rounded-lg bg-accent px-6 font-mono text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {"> ver_experiencia()"}
            </a>
            <a
              href="/cv.pdf"
              download
              className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-6 font-mono text-sm font-medium text-foreground transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              [ baixar_cv.pdf ]
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div
            className="relative h-full w-full overflow-hidden border border-accent/30 bg-gradient-to-br from-accent/15 to-transparent"
            style={{
              clipPath:
                "polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)",
            }}
          >
            <Image
              src="/profile.jpg"
              alt={profile.name}
              fill
              sizes="(min-width: 1024px) 24rem, 80vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-4 -left-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent font-mono text-lg font-semibold text-white shadow-lg">
            {"</>"}
          </div>
        </div>
      </div>
    </section>
  );
}
