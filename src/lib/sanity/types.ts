export interface ArticleImage {
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface ArticleCategory {
  title: string;
  slug: string;
}

export interface ArticleAuthor {
  name: string;
  image?: ArticleImage;
}

// Portable Text is an array of typed content blocks; the exact block shape
// varies by type (block, image, code, ...), so it is rendered generically
// through @portabletext/react rather than modeled field-by-field here.
export type PortableTextContent = Array<Record<string, unknown>>;

export interface ArticleSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: ArticleImage;
  publishedAt: string;
  category?: ArticleCategory;
  tags?: string[];
  readingTime?: number;
  featured: boolean;
}

export interface Article extends ArticleSummary {
  body: PortableTextContent;
  author?: ArticleAuthor;
}
