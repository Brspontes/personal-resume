import { profile } from "@/data/profile";

const linkClasses =
  "transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function Footer() {
  const { email, channels } = profile.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-300 px-6 py-8 sm:px-10 lg:px-16 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 text-sm text-zinc-500 sm:flex-row sm:justify-between dark:text-zinc-500">
        <div>
          <p className="font-medium text-zinc-600 dark:text-zinc-400">{profile.name}</p>
          <p>{profile.role}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
              {channel.label}
            </a>
          ))}
        </div>

        <p>
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  );
}
