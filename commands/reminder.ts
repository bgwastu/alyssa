import { Composer } from "https://deno.land/x/grammy@v1.19.2/mod.ts";
import dayjs from "npm:dayjs";
import relativeTime from "npm:dayjs/plugin/relativeTime.js";
import { parse, remind } from "../modules/reminder.ts";

dayjs.extend(relativeTime);

export const composer = new Composer();

// /reminder {message}, {natural date}
// /reminder me at dinner party, tommorow at 10am
composer.command("reminder", (context) => {
  try {
    const text = context.match;
    if (text.length === 0) {
      context.reply("How to use: /reminder {message}, {natural date}", {
        reply_to_message_id: context.message!.message_id,
      });
      return;
    }

    // get natural date
    const args = context.match.split(/\,\s?/);

    if (args.length < 2) {
      context.reply(
        "How to use:\n`/reminder {message}, {natural date}`\nExample:\n`/reminder kill frogs, in next sunday at 3pm`",
        {
          reply_to_message_id: context.message!.message_id,
          parse_mode: "Markdown",
        }
      );
      return;
    }

    const naturalDate = args.pop()!;

    const date = parse(naturalDate);

    // get message
    const message = text
      .replace(`, ${naturalDate}`, "")
      .replace(`,${naturalDate}`, "")
      .trim();

    if (message.length === 0) {
      context.reply(
        "How to use:\n`/reminder {message}, {natural date}`\nExample:\n`/reminder kill frogs, in next sunday at 3pm`",
        {
          reply_to_message_id: context.message!.message_id,
          parse_mode: "Markdown",
        }
      );
      return;
    }

    // get username
    const username = context.from?.username;

    if (username === undefined) {
      context.reply("u need to set your username first.");
      return;
    }

    // get chat id
    const chatId = context.chat?.id;

    remind({
      message,
      naturalDate,
      telegramUsername: username,
      telegramChatId: chatId.toString(),
    });

    context.reply(
      `okey-dokey, i'll remind you *${dayjs(date).fromNow()}* from now.`,
      {
        reply_to_message_id: context.message!.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (e) {
    context.reply(e.message, {
      reply_to_message_id: context.message!.message_id,
    });
  }
});
