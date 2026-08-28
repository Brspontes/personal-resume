import { profile } from "@/data/profile";

const linkClasses =
  "rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:border-accent/50 focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-zinc-700";

export default function Contact() {
  const { email, channels } = profile.contact;

  return (
    <section
      id="contact"
      className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-accent">{"// Contact"}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Vamos conversar?
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Estou aberto a novas oportunidades e conversas. Entre em contato por qualquer um dos
          canais abaixo.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${email}`} className={linkClasses}>
            {email}
          </a>
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              {channel.value}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
