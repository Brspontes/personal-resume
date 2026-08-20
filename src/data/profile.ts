export interface Profile {
  name: string;
  role: string;
  headline: string;
  location: string;
  summary: string;
  techStack: string[];
}

export const profile: Profile = {
  name: "Brian Pontes",
  role: "Senior Backend Engineer",
  headline: "Full Stack Developer",
  location: "Sorocaba, São Paulo, Brasil",
  summary:
    "Engenheiro de software com 7 anos de experiência em Backend e Frontend, atualmente atuando como Senior Backend Engineer. Trabalho com Node.js, TypeScript, C# (.NET) e Kotlin, sempre buscando entender a teoria por trás da prática e crescer tecnicamente.",
  techStack: ["Node.js", "TypeScript", "React", ".NET", "Kotlin"],
};
