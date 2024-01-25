import { Composer } from "https://deno.land/x/grammy@v1.19.2/composer.ts";
import { CustomContext } from "../index.ts";
import { TidyURL } from "npm:tidy-url";

export const composer = new Composer<CustomContext>();

composer.on("message:entities:url", async (context) => {
  const urls = context.message.entities
    .filter((e) => e.type === "text_link" || e.type === "url")
    .map((e) => context.message.text.substring(e.offset));

  if (urls.length === 0) {
    return;
  }

  const cleanedUrls = urls
    .map((e) => TidyURL.clean(e))
    .filter((e) => e.info.difference > 0)
    .map((e) => e.url);

  if (cleanedUrls.length === 0) {
    return;
  }

  // single
  if (cleanedUrls.length === 1) {
    await context.reply(`Cleaned link:\n${cleanedUrls.join("\n")}`, {
      reply_to_message_id: context.message?.message_id,
    });
    return;
  }

  // more than one
  await context.reply(
    `Cleaned links:\n${cleanedUrls.map((e) => "- " + e).join("\n")}`,
    {
      reply_to_message_id: context.message?.message_id,
    }
  );
});
