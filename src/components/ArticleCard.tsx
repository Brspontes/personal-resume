import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity/image";
import type { ArticleSummary } from "@/lib/sanity/types";
import { formatArticleDate, formatReadingTime } from "@/lib/format";

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  const coverUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(640).height(360).fit("crop").url()
    : null;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-lg border transition-colors hover:border-accent/50 ${
        article.featured
          ? "border-accent/40 bg-accent/5"
          : "border-zinc-300 dark:border-zinc-700"
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={article.coverImage?.alt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center font-mono text-xs text-zinc-400 dark:text-zinc-600"
          >
            {"</>"}
          </div>
        )}
        {article.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 font-mono text-xs font-medium text-white">
            Destaque
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {article.category && (
          <p className="font-mono text-xs text-accent">{article.category.title}</p>
        )}
        <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
        <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">{article.excerpt}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 font-mono text-xs text-zinc-500 dark:text-zinc-500">
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          {article.readingTime !== undefined && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatReadingTime(article.readingTime)}</span>
            </>
          )}
        </div>

        {article.tags && article.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-zinc-300 px-2 py-0.5 font-mono text-[0.65rem] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
