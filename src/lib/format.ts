export function formatArticleDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min de leitura`;
}
