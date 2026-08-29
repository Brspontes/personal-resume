"use client";

import { useEffect } from "react";

export default function ArticlesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="px-6 py-24 text-center sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-2xl">
        <p className="font-mono text-sm text-accent">{"// erro"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Não foi possível carregar os artigos
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Tente novamente em instantes. O restante do site continua disponível.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-6 font-mono text-sm font-medium text-foreground transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {"↻ tentar_novamente()"}
        </button>
      </div>
    </section>
  );
}
