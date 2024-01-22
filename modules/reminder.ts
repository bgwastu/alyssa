import { load } from "https://deno.land/std@0.209.0/dotenv/mod.ts";
import { Bot } from "https://deno.land/x/grammy@v1.19.2/bot.ts";
import * as chrono from "npm:chrono-node";
import dayjs from "npm:dayjs";
import relativeTime from "npm:dayjs/plugin/relativeTime.js";
import utc from "npm:dayjs/plugin/utc.js";
import { CustomContext } from "../index.ts";
import kv from "../lib/kv.ts";

dayjs.extend(relativeTime);
dayjs.extend(utc);
await load({ export: true });

export interface Reminder {
  message: string;
  naturalDate: string;
  telegramUsername: string;
  telegramChatId: string;
}

export async function remind(reminder: Reminder) {
  const date = parse(reminder.naturalDate);
  const delay = date.getTime() - Date.now();

  await kv.enqueue(reminder, { delay });
}

export function parse(text: string): Date {
  const date = chrono.parseDate(text);

  if (!date) {
    throw new Error("i can't understand the date, sorry :(");
  }

  if (dayjs(date).isBefore(dayjs())) {
    throw new Error("you stupid or what, that date is in the past.");
  }

  return date;
}

export function listenReminder(bot: Bot<CustomContext>) {
  kv.listenQueue(async (reminder: Reminder) => {
    const res = await bot.api.sendMessage(
      reminder.telegramChatId,
      `*hey @${reminder.telegramUsername}, here's your reminder:*\n${reminder.message}\n`,
      {
        parse_mode: "Markdown",
      }
    );

    console.log(res);
  });
}
