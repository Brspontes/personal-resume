import { profile } from "@/data/profile";
import HighlightCounter from "./HighlightCounter";

export default function ProfessionalHighlights() {
  return (
    <section
      id="highlights"
      className="bg-grid-pattern relative overflow-hidden px-6 pt-8 pb-16 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4">
        {profile.highlights.map((highlight) => (
          <div
            key={highlight.label}
            className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left"
          >
            <HighlightCounter value={highlight.value} suffix={highlight.suffix} />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {highlight.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
