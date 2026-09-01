import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { getLatestArticles } from "@/lib/sanity/queries";

const LATEST_ARTICLES_LIMIT = 3;

export default async function LatestArticles() {
  let articles;
  try {
    articles = await getLatestArticles(LATEST_ARTICLES_LIMIT);
  } catch (error) {
    console.error("Failed to load latest articles", error);
    return null;
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      id="latest-articles"
      className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono text-sm text-accent">{"// Articles"}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Últimos artigos
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Textos técnicos, aprendizados e experiências profissionais.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ver todos os artigos
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
