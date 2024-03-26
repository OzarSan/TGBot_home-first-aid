import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { chatGPT } from "./chatgpt.js";
import { create } from "./notion.js";
import { Loader } from "./loader.js";
const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
  handlerTimeout: Infinity,
});

bot.command("start", (cxt) => {
  cxt.reply("Hi I'm new bot");
});

bot.on(message("text"), async (cxt) => {
  try {
    const text = cxt.message.text;
    if (!text.trim()) cxt.reply("No empty text");

    const loader = new Loader(cxt);
    loader.show();
    const response = await chatGPT(text);
    if (!response) return cxt.reply("error with gpt", response);

    const notionResponse = await create(text, response.content);
    loader.hide();
    cxt.reply(`${response.content}\nYour URL: ${notionResponse.url}`);
  } catch (err) {
    console.log("error while processing text to gpt");
  }
});

bot.launch();
