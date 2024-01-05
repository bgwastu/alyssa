import { load } from "https://deno.land/std@0.209.0/dotenv/mod.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

await load({ export: true });

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function ask(
  question: string,
  historyMessages: Message[],
  model: "gpt-3.5-turbo" | "gpt-4"
) {
  const res = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Current Year: ${new Date().getFullYear()}. You're a intelligent assistant who will write concise answer and easily readable on small screens.`,
      },
      ...historyMessages,
      {
        role: "user",
        content: question,
      },
    ],
    max_tokens: 512,
    temperature: 0.6,
    model,
  });

  return res.choices[0].message.content;
}
