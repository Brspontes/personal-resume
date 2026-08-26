import Hero from "@/components/Hero";
import ProfessionalHighlights from "@/components/ProfessionalHighlights";
import ProfessionalExperience from "@/components/ProfessionalExperience";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProfessionalHighlights />
      <ProfessionalExperience />
      <Skills />
    </main>
  );
}
