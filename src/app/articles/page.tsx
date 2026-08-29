import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Artigos | Brian Pontes",
  description: "Artigos técnicos, aprendizados e experiências profissionais de Brian Pontes.",
  alternates: {
    canonical: "/articles",
  },
};

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <section className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16">
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-accent">{"// Conteúdo"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Artigos
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Textos técnicos, aprendizados e experiências profissionais.
        </p>

        {articles.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="font-mono text-sm text-zinc-500 dark:text-zinc-500">
              Nenhum artigo publicado ainda. Volte em breve!
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
