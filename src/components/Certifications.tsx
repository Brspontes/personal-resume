import { profile } from "@/data/profile";
import type { CertificationEntry } from "@/data/profile";

function CertificationCard({ certification }: { certification: CertificationEntry }) {
  const { name, issuer, issuedAt, expiresAt, credentialId, credentialUrl } = certification;

  const content = (
    <div className="flex h-full flex-col rounded-lg border border-zinc-300 p-6 transition-colors hover:border-accent/50 dark:border-zinc-700">
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      {issuer && (
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{issuer}</p>
      )}
      {(issuedAt || expiresAt) && (
        <p className="mt-2 font-mono text-sm text-accent">
          {issuedAt}
          {issuedAt && expiresAt && " — "}
          {expiresAt}
        </p>
      )}
      {credentialId && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
          Credential ID: {credentialId}
        </p>
      )}
      {credentialUrl && (
        <span className="mt-3 text-sm font-medium text-accent underline underline-offset-2">
          Verificar credencial
        </span>
      )}
    </div>
  );

  if (credentialUrl) {
    return (
      <a
        href={credentialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-72 shrink-0"
      >
        {content}
      </a>
    );
  }

  return <div className="w-72 shrink-0">{content}</div>;
}

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-accent">{"// Certifications"}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Certificações
        </h2>

        <div className="mt-10 flex flex-wrap gap-4">
          {profile.certifications.map((certification) => (
            <CertificationCard key={certification.id} certification={certification} />
          ))}
        </div>
      </div>
    </section>
  );
}
