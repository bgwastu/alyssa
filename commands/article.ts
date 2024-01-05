import { Composer } from "https://deno.land/x/grammy@v1.19.2/composer.ts";
import { CustomContext } from "../index.ts";
import { getArticle } from "../modules/article.ts";
import { Message, ask } from "../modules/openai.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.19.2/mod.ts";

export const composer = new Composer<CustomContext>();

// > someurl.com
// @bot <question>
composer.on("message:entities:mention").filter(
  (c) => {
    const isReplyingFromUrl =
      c.msg.reply_to_message?.entities?.[0].type === "url";

    const match = c.msg.text.match(/@(\w+)\s(.+)/);
    const [mention, question] = match ? match.slice(1) : [];
    const isMentioningBot = mention === c.me.username;

    return isReplyingFromUrl && isMentioningBot && question.length > 1;
  },
  async (context) => {
    context.chatAction = "typing";
    const url =
      context.message!.reply_to_message!.text!.match(/https?:\/\/[^\s]+/g)![0];

    const question = context
      .message!.text!.replace(`@${context.me.username}`, "")
      .trim();

    try {
      const article = await getArticle(url);

      const messages: Message[] = [
        {
          role: "user",
          content: `Here is a text content from ${url} with the title of ${article.title}, ignore unrelated content:\n${article.content}`,
        },
      ];

      const answer = await ask(question, messages, "gpt-4");
      const result = `*Article title:*
${article.title}

*Question:*
${question}

*Answer:*
${answer}`;
      await context.reply(result, {
        reply_to_message_id: context.message?.message_id,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: new InlineKeyboard().url("See full article", url),
      });
    } catch (error) {
      console.error(error);
      await context.reply(
        `An error occurred.\n\n*Detail:*\n \`${error.message}\``,
        {
          reply_to_message_id: context.message?.message_id,
          parse_mode: "Markdown",
        }
      );
    }
  }
);

// > someurl.com
// @bot
composer.on("message:entities:mention").filter(
  (c) => {
    const isReplyingFromUrl =
      c.msg.reply_to_message?.entities?.[0].type === "url";

    const match = c.msg.text.match(/@(\w+)/);
    const mention = match?.[1];
    const isMentioningBot = mention === c.me.username;

    return isReplyingFromUrl && isMentioningBot;
  },
  async (context) => {
    context.chatAction = "typing";
    const url =
      context.message!.reply_to_message!.text!.match(/https?:\/\/[^\s]+/g)![0];

    const question = `Get the summary of the article using bullet points. ALWAYS ADD "*Summary:*" at the beginning.`;

    try {
      const article = await getArticle(url);

      const messages: Message[] = [
        {
          role: "user",
          content: `Here is a text content from ${url} with the title of ${article.title}, ignore unrelated content:\n${article.content}`,
        },
      ];

      const answer = await ask(question, messages, "gpt-4");
      const result = `*Article title:*
${article.title}

${answer}`;
      await context.reply(result, {
        reply_to_message_id: context.message?.message_id,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: new InlineKeyboard().url("See full article", url),
      });
    } catch (error) {
      console.error(error);
      await context.reply(
        `An error occurred.\n\n*Detail:*\n \`${error.message}\``,
        {
          reply_to_message_id: context.message?.message_id,
          parse_mode: "Markdown",
        }
      );
    }
  }
);
