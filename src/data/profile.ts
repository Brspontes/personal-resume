export interface Highlight {
  value: number;
  suffix?: string;
  label: string;
}

export interface ExperiencePosition {
  role: string;
  period: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location?: string;
  current?: boolean;
  description?: string;
  responsibilities: string[];
  technologies?: string[];
  logo?: string;
  positions?: ExperiencePosition[];
}

export interface Profile {
  name: string;
  role: string;
  headline: string;
  location: string;
  summary: string;
  techStack: string[];
  highlights: Highlight[];
  experiences: ExperienceEntry[];
  skills: string[];
}

export const profile: Profile = {
  name: "Brian Pontes",
  role: "Tech Lead",
  headline: "Full Stack Developer",
  location: "Sorocaba, São Paulo, Brasil",
  summary:
    "Engenheiro de software com mais de 10 anos de experiência em Backend e Frontend, atualmente atuando como Tech Lead. Trabalho com Node.js, TypeScript, C# (.NET) e Kotlin, sempre buscando entender a teoria por trás da prática e crescer tecnicamente.",
  techStack: ["Node.js", "TypeScript", "React", ".NET", "Kotlin"],
  highlights: [
    { value: 10, suffix: "+", label: "Anos de Experiência" },
    { value: 9, label: "Empresas" },
    { value: 5, label: "Certificações" },
    { value: 2, label: "Idiomas" },
  ],
  experiences: [
    {
      company: "Caju",
      role: "Tech Lead",
      period: "Setembro de 2024 — Atual",
      location: "São Paulo, Brasil",
      current: true,
      logo: "/logos/caju.svg",
      positions: [
        { role: "Tech Lead", period: "Agosto de 2026 — Atual" },
        {
          role: "Senior Backend Engineer",
          period: "Setembro de 2024 — Agosto de 2026",
        },
      ],
      description:
        "Atuação em backend com Kotlin, utilizando os frameworks Spring Boot e Micronaut. Aplicação de arquitetura hexagonal, testes unitários e de integração com Kotest, integração com serviços AWS e Kafka para mensageria, monitoramento com Datadog e gestão de bancos MySQL.",
      responsibilities: [
        "Desenvolvimento e manutenção de soluções backend com Kotlin, Spring Boot e Micronaut",
        "Implementação de arquitetura hexagonal para modularidade e escalabilidade",
        "Testes unitários e de integração com Kotest",
        "Integração de serviços AWS e Kafka para mensageria e processamento de dados",
        "Monitoramento de performance e saúde das aplicações com Datadog",
        "Gestão de bancos de dados MySQL",
        "Colaboração com times multidisciplinares",
      ],
      technologies: [
        "Kotlin",
        "Spring Boot",
        "Micronaut",
        "Kotest",
        "AWS",
        "Kafka",
        "Datadog",
        "MySQL",
        "PostgreSQL",
        "Docker",
        "Node.js",
        "TypeScript",
        "React",
        "Claude",
      ],
    },
    {
      company: "Apply",
      role: "Tech Consultant | Tech Lead",
      period: "Junho de 2023 — Novembro de 2024",
      location: "Portugal",
      logo: "/logos/apply.jpg",
      description:
        'Desenvolvimento de uma plataforma inovadora de ofertas de trabalho temporário, integrando soluções mobile, backend e frontend. Responsável pelo design arquitetural de sistemas e bancos de dados, aplicando o conceito "code first", da concepção à implementação, garantindo escalabilidade e alta performance.',
      responsibilities: [
        "Desenvolvimento e manutenção de APIs robustas com Node.js e NestJS",
        "Implementação de testes unitários e de integração com Jest",
        "Uso de TypeScript e JavaScript no frontend e backend",
        "Configuração e automação de pipelines de CI/CD",
        "Implementação de funções serverless com AWS Lambda",
        "Gestão de infraestrutura AWS para alta disponibilidade e segurança",
        "Design e otimização de bancos de dados PostgreSQL e MongoDB",
        "Colaboração com times multidisciplinares na integração mobile e web",
      ],
      technologies: [
        "Node.js",
        "NestJS",
        "Jest",
        "TypeScript",
        "JavaScript",
        "CI/CD",
        "AWS Lambda",
        "AWS",
        "PostgreSQL",
        "MongoDB",
      ],
    },
    {
      company: "will bank",
      role: "Senior Full Stack Engineer",
      period: "Maio de 2022 — Agosto de 2024",
      location: "São Paulo, Brasil",
      logo: "/logos/will-bank.svg",
      description:
        "Desenvolvimento de soluções de ponta por meio de análise e design arquitetural, integrando tecnologias e metodologias modernas. Foco em sistemas escaláveis e de alta performance com abordagem de microsserviços, computação em nuvem e containerização.",
      responsibilities: [
        "Análise de soluções e criação de designs arquiteturais robustos",
        "Desenvolvimento e manutenção de aplicações com Node.js e NestJS",
        "Design e implementação de microsserviços",
        "Construção de interfaces interativas e responsivas com React",
        "Escrita e manutenção de testes unitários e de integração",
        "Gestão e otimização de bancos de dados PostgreSQL",
        "Realização de code reviews detalhados",
        "Uso de Docker para containerização",
        "Implementação de arquitetura orientada a mensagens com Kafka",
        "Uso de AWS para infraestrutura em nuvem escalável e segura",
        "Desenvolvimento de aplicações serverless",
        "Monitoramento e análise de performance com Datadog",
      ],
      technologies: [
        "Node.js",
        "NestJS",
        "Microservices",
        "React",
        "PostgreSQL",
        "Docker",
        "Kafka",
        "AWS",
        "Serverless",
        "Datadog",
      ],
    },
    {
      company: "Vórtx",
      role: "Mid Full Stack Engineer",
      period: "Dezembro de 2020 — Maio de 2022",
      logo: "/logos/vortx.svg",
      description:
        "Foco em soluções escaláveis e eficientes por meio de uma abordagem abrangente de desenvolvimento de software, com experiência no design e implementação de sistemas complexos e integração entre plataformas.",
      responsibilities: [
        "Análise de soluções e arquitetura",
        "Desenvolvimento backend com Node.js (JavaScript/TypeScript) e .NET Core (C#)",
        "Desenvolvimento frontend com Razor e React",
        "Integração de serviços AWS (Memcached, S3, SQS e Lambda)",
        "Desenvolvimento de microsserviços",
        "Gestão e otimização de bancos de dados SQL Server",
      ],
      technologies: [
        "Node.js",
        "TypeScript",
        ".NET Core",
        "C#",
        "Razor",
        "React",
        "AWS",
        "SQL Server",
      ],
    },
    {
      company: "Função Sistemas - PÁGINA OFICIAL",
      role: "Mid System Analyst",
      logo: "/logos/funcao.jpg",
      period: "Setembro de 2020 — Novembro de 2020",
      responsibilities: [
        "Desenvolvimento backend em .NET",
        "Desenvolvimento frontend com ASP.NET",
        "Administração de banco de dados SQL Server",
        "Criação de Stored Procedures",
        "Administração de servidores Windows Server 2012",
      ],
      technologies: [".NET", "ASP.NET", "SQL Server", "Windows Server 2012"],
    },
    {
      company: "Itaú",
      role: "Jr Software Engineer",
      period: "Julho de 2017 — Setembro de 2020",
      location: "São Paulo",
      logo: "/logos/itau.svg",
      responsibilities: [
        "Análise de soluções",
        "Monitoramento de projetos ponta a ponta (e2e)",
        "Desenvolvimento em .NET Full Framework e .NET Core",
        "Desenvolvimento frontend com ASP, HTML5 e CSS3",
        "Implantação de projetos",
        "Evolução de plataformas",
        "Redução de consumo de processamento",
      ],
      technologies: [
        ".NET Full Framework",
        ".NET Core",
        "ASP",
        "HTML5",
        "CSS3",
        "SQL Server",
        "Windows Server 2012",
        "Oracle",
        "Splunk",
      ],
    },
    {
      company: "KCMS Intelligent Solutions",
      role: "Jr Developer",
      logo: "/logos/kcms.png",
      period: "Março de 2017 — Julho de 2017",
      location: "Sorocaba e Região, Brasil",
      responsibilities: [
        "Desenvolvimento backend com .NET Core",
        "Desenvolvimento frontend com HTML5, CSS3, Bootstrap e jQuery",
        "Administração de banco de dados SQL Server",
        "Uso de nuvem Azure",
      ],
      technologies: [
        ".NET Core",
        "HTML5",
        "CSS3",
        "Bootstrap",
        "jQuery",
        "SQL Server",
        "Azure",
      ],
    },
    {
      company: "FIT - Instituto de Tecnologia",
      role: "Jr Tester",
      period: "Abril de 2015 — Março de 2017",
      logo: "/logos/fit.png",
      responsibilities: [
        "Testes de segurança elétrica",
        "Testes não funcionais",
        "Desenvolvimento com .NET Windows Forms",
        "Administração de banco de dados SQL Server",
      ],
      technologies: [".NET", "SQL Server"],
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "C#",
    "Kotlin",
    "Node.js",
    "NestJS",
    "Spring Boot",
    "Micronaut",
    ".NET",
    "ASP.NET",
    "Razor",
    "React",
    "HTML5",
    "CSS3",
    "Bootstrap",
    "jQuery",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "SQL Server",
    "Oracle",
    "AWS",
    "AWS Lambda",
    "Azure",
    "Docker",
    "Serverless",
    "Kafka",
    "Jest",
    "Kotest",
    "CI/CD",
    "Datadog",
    "Splunk",
    "Microservices",
    "Hexagonal Architecture",
    "Claude",
  ],
};
