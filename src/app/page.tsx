import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProfessionalHighlights from "@/components/ProfessionalHighlights";
import ProfessionalExperience from "@/components/ProfessionalExperience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProfessionalHighlights />
        <ProfessionalExperience />
        <Skills />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
