import { webhookCallback } from "https://deno.land/x/grammy@v1.19.2/mod.ts";
import { Hono } from "https://deno.land/x/hono@v3.11.12/mod.ts";
import bot from "./bot.ts";

const app = new Hono();

// set telegram webhook
if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  const domain = Deno.env.get("DEPLOYMENT_URL");
  bot.api.setWebhook(`${domain}/${bot.token}`);
  app.post(`/${bot.token}`, webhookCallback(bot, "hono"));
}

Deno.serve(app.fetch);

if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  bot.start();
}
