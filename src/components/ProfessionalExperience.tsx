import { profile } from "@/data/profile";
import ExperienceNavigator from "./ExperienceNavigator";

export default function ProfessionalExperience() {
  return (
    <section
      id="experience"
      className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-accent">{"// Trajetória"}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Experiência Profissional
        </h2>

        <div className="mt-10">
          <ExperienceNavigator experiences={profile.experiences} />
        </div>
      </div>
    </section>
  );
}
