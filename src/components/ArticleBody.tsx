import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { PortableTextContent } from "@/lib/sanity/types";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
    ),
    h4: ({ children }) => <h4 className="mt-6 text-lg font-semibold text-foreground">{children}</h4>,
    normal: ({ children }) => (
      <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-accent pl-4 italic text-zinc-600 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";

      if (href.startsWith("http")) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={href} className="text-accent underline underline-offset-2 hover:opacity-80">
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1200).fit("max").url();
      if (!url) return null;

      const alt = typeof value?.alt === "string" ? value.alt : "";

      return (
        <span className="relative mt-6 block aspect-video w-full overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
          <Image
            src={url}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover"
          />
        </span>
      );
    },
    code: ({ value }) => (
      <pre className="mt-6 overflow-x-auto rounded-lg border border-zinc-300 bg-zinc-100 p-4 font-mono text-sm text-foreground dark:border-zinc-700 dark:bg-zinc-900">
        <code>{typeof value?.code === "string" ? value.code : ""}</code>
      </pre>
    ),
  },
  // Any block type the schema introduces later that isn't handled above is
  // silently skipped instead of throwing, so one unsupported block never
  // takes down the rest of the article.
  unknownType: () => null,
  unknownMark: ({ children }) => <>{children}</>,
  unknownBlockStyle: ({ children }) => (
    <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>
  ),
};

export default function ArticleBody({ value }: { value: PortableTextContent }) {
  return <PortableText value={value} components={components} />;
}
