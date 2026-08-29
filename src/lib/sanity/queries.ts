import { sanityFetch } from "./client";
import type { Article, ArticleSummary } from "./types";

// Excludes drafts and anything scheduled in the future, so unpublished
// content can never reach a public route regardless of which query runs it.
const PUBLISHED_FILTER = `_type == "article" && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()`;

const ARTICLE_SUMMARY_FIELDS = `
  "_id": _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "category": category->{title, "slug": slug.current},
  tags,
  readingTime,
  "featured": featured == true
`;

const ARTICLE_SUMMARY_PROJECTION = `{${ARTICLE_SUMMARY_FIELDS}}`;

const ARTICLE_PROJECTION = `{${ARTICLE_SUMMARY_FIELDS},
  body,
  author->{name, image}
}`;

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  const query = `*[${PUBLISHED_FILTER}] | order(publishedAt desc) ${ARTICLE_SUMMARY_PROJECTION}`;
  return sanityFetch<ArticleSummary[]>(query, {}, []);
}

export async function getFeaturedArticles(): Promise<ArticleSummary[]> {
  const query = `*[${PUBLISHED_FILTER} && featured == true] | order(publishedAt desc) ${ARTICLE_SUMMARY_PROJECTION}`;
  return sanityFetch<ArticleSummary[]>(query, {}, []);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const query = `*[${PUBLISHED_FILTER} && slug.current == $slug][0] ${ARTICLE_PROJECTION}`;
  return sanityFetch<Article | null>(query, { slug }, null);
}

export async function getArticleCategories(): Promise<{ title: string; slug: string }[]> {
  const query = `*[_type == "category"] | order(title asc) {title, "slug": slug.current}`;
  return sanityFetch<{ title: string; slug: string }[]>(query, {}, []);
}

export async function getArticleTags(): Promise<string[]> {
  const query = `array::unique(*[${PUBLISHED_FILTER}].tags[])`;
  return sanityFetch<string[]>(query, {}, []);
}
