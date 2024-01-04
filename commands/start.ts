import { Composer } from "https://deno.land/x/grammy@v1.19.2/mod.ts";

export const composer = new Composer();

composer.command("start", (context) => {
  context.reply(
    `I can assist you with several things:

*Summarize the article:*
Mention me on reply if you want to summarize the article.
*Example:*
\`\`\`
> ini bagus juga https://teknologiumum.com/posts/lesson-learned-from-running-a-community-tech-conference
@${context.me.username}
\`\`\`

Mention me on reply, followed with question if you want to ask spesific things from the article.
*Example:*
\`\`\`
> ini bagus juga https://teknologiumum.com/posts/lesson-learned-from-running-a-community-tech-conference
@${context.me.username} siapa itu reinaldy?
\`\`\`
`,
    { parse_mode: "Markdown" }
  );
});
