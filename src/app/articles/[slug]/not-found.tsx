import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <section className="px-6 py-24 text-center sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-2xl">
        <p className="font-mono text-sm text-accent">{"// 404"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Artigo não encontrado
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Este artigo não existe ou ainda não foi publicado.
        </p>
        <Link
          href="/articles"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-accent px-6 font-mono text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {"→ ver_artigos()"}
        </Link>
      </div>
    </section>
  );
}
