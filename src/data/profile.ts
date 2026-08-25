export interface Highlight {
  value: number;
  suffix?: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  headline: string;
  location: string;
  summary: string;
  techStack: string[];
  highlights: Highlight[];
}

export const profile: Profile = {
  name: "Brian Pontes",
  role: "Senior Backend Engineer",
  headline: "Full Stack Developer",
  location: "Sorocaba, São Paulo, Brasil",
  summary:
    "Engenheiro de software com mais de 10 anos de experiência em Backend e Frontend, atualmente atuando como Senior Backend Engineer. Trabalho com Node.js, TypeScript, C# (.NET) e Kotlin, sempre buscando entender a teoria por trás da prática e crescer tecnicamente.",
  techStack: ["Node.js", "TypeScript", "React", ".NET", "Kotlin"],
  highlights: [
    { value: 10, suffix: "+", label: "Anos de Experiência" },
    { value: 9, label: "Empresas" },
    { value: 5, label: "Certificações" },
    { value: 2, label: "Idiomas" },
  ],
};
