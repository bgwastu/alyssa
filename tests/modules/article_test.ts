import { assertExists } from "https://deno.land/std@0.209.0/assert/assert_exists.ts";
import { getArticle } from "../../modules/article.ts";

Deno.test("getArticle", async () => {
  const url = "https://terrytao.wordpress.com/career-advice/ask-yourself-dumb-questions-and-answer-them/";
  const article = await getArticle(url);
  assertExists(article);
});
