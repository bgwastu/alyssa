import { extract } from "npm:@extractus/article-extractor";

export async function getArticle(url: string) {
  const article = await extract(url);

  if (article?.content === undefined) {
    throw new Error("Article not found");
  }

  const cleanedContent = article.content
    .replace(/<(br|p|div)[^>]*>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim();

  return {
    title: article.title ?? "Unknown title",
    content: cleanedContent,
    url,
  };
}
