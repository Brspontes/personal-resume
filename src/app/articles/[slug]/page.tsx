import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleAnalytics from "@/components/ArticleAnalytics";
import ArticleBody from "@/components/ArticleBody";
import ArticleReactions from "@/components/ArticleReactions";
import ArticleComments from "@/components/ArticleComments";
import { urlForImage } from "@/lib/sanity/image";
import { getArticleBySlug } from "@/lib/sanity/queries";
import { formatArticleDate, formatReadingTime } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artigo não encontrado | Brian Pontes" };
  }

  const coverUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: `${article.title} | Brian Pontes`,
    description: article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/articles/${article.slug}`,
      publishedTime: article.publishedAt,
      images: coverUrl ? [{ url: coverUrl }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const coverUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(1600).height(900).fit("crop").url()
    : null;

  return (
    <article className="bg-grid-pattern relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16">
      <div className="relative mx-auto w-full max-w-3xl">
        <Link
          href="/articles"
          className="text-sm text-accent transition-opacity hover:opacity-80"
        >
          {"← Voltar para artigos"}
        </Link>

        <div className="mt-6">
          {article.category && (
            <p className="font-mono text-sm text-accent">{article.category.title}</p>
          )}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-zinc-500 dark:text-zinc-500">
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
            {article.readingTime !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatReadingTime(article.readingTime)}</span>
              </>
            )}
            {article.author && (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.author.name}</span>
              </>
            )}
          </div>
        </div>

        {coverUrl && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
            <Image
              src={coverUrl}
              alt={article.coverImage?.alt ?? ""}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div id="article-content" className="mt-8">
          <ArticleBody value={article.body} />
        </div>

        <ArticleAnalytics articleId={article._id} />

        {article.tags && article.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2 border-t border-zinc-300 pt-6 dark:border-zinc-700">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-zinc-300 px-3 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <ArticleReactions articleId={article._id} articleSlug={article.slug} />

        <ArticleComments articleId={article._id} articleSlug={article.slug} />

        <div className="mt-10">
          <Link
            href="/articles"
            className="text-sm text-accent transition-opacity hover:opacity-80"
          >
            {"← Voltar para artigos"}
          </Link>
        </div>
      </div>
    </article>
  );
}
