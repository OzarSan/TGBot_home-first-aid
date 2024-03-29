import { Loader } from "../src/loader.js";
import { message } from "telegraf/filters";
import { chatGPT } from "../src/chatgpt.js";
import { create, checkDB } from "../src/notion.js";

export const responseGPT = async (bot, ctx) => {
  try {
    const text = ctx.message.text;
    if (!text.trim()) ctx.reply("No empty text");

    const loader = new Loader(ctx);
    loader.show();
    const responsGpt = await chatGPT(text);
    if (!responsGpt) return ctx.reply("error with gpt", responsGpt);
    loader.hide();
    return responsGpt;
  } catch (err) {
    console.log("error while processing text to gpt");
  }
};

export const searchDB = async (ctx) => {
  const chechNotionResult = await checkDB(ctx.message.text);
  if (chechNotionResult.results.length !== 0) {
    ctx.reply("Yes");
  } else {
    ctx.reply("No");
  }
};
export const addToNotion = async (ctx, responseFromGPT) => {
  try {
    const parsedRespons = responseFromGPT.content.split("\n");
    const parsedForUse = parsedRespons[1].split(":");
    const parsedCategory = parsedRespons[2].split(":");
    const parsedHowUse = parsedRespons[3].split(":");
    const responsNotion = await create(
      ctx.message.text,
      responseFromGPT.content,
      parsedForUse,
      parsedCategory,
      parsedHowUse
    );
  } catch (err) {
    ctx.reply("Не вдалося розпізнати препарат та додати у список");
    return;
  }
};
