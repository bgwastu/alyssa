import { load } from "https://deno.land/std@0.209.0/dotenv/mod.ts";
import {
  Bot,
  Context,
  NextFunction,
} from "https://deno.land/x/grammy@v1.19.2/mod.ts";
import {
  AutoChatActionFlavor,
  autoChatAction,
} from "https://deno.land/x/grammy_auto_chat_action@v0.1.1/mod.ts";
import { autoRetry } from "https://esm.sh/@grammyjs/auto-retry@1.1.1";
import { composer as start } from "./commands/start.ts";
import { composer as article } from "./commands/article.ts";
import { composer as reminder } from "./commands/reminder.ts";
import { listenReminder } from "./modules/reminder.ts";
import kv from "./lib/kv.ts";
import type { Reminder } from "./modules/reminder.ts";

await load({ export: true });

export type CustomContext = Context & AutoChatActionFlavor;

const bot = new Bot<CustomContext>(Deno.env.get("TELEGRAM_TOKEN")!);

bot.api.config.use(autoRetry());
bot.use(autoChatAction());
bot.use(start);
bot.use(article);
bot.use(reminder);
listenReminder(bot);

// check id
bot.command("id", (ctx) => ctx.reply(String(ctx.chat?.id)));

bot.catch((err) => {
  console.error("An error occurred:", err);
});


// use polling instead
bot.start();
