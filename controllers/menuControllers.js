import { Loader } from "../src/loader.js";
import { chatGPT } from "../src/chatgpt.js";
import { create, checkDB } from "../src/notion.js";

export const responseGPT = async (ctx) => {
  try {
    const text = ctx.message.text;
    if (!text.trim()) ctx.reply("Назва не може бути пуста");
    const loader = new Loader(ctx);
    loader.show();
    const responsGpt = await chatGPT(text);
    if (!responsGpt)
      return ctx.reply("Штучний інтелект не надав відповіді", responsGpt);
    loader.hide();
    return responsGpt;
  } catch (err) {
    ctx.reply("Нажаль не можливо скористатися штучним інтелектом");
  }
};

export const searchDB = async (bot, ctx) => {
  const chechNotionResult = await checkDB(ctx.message.text);
  if (chechNotionResult.results.length !== 0) {
    ctx.reply("Знайдено в аптечці");
    //return "Знайдено в аптечці";
  } else {
    ctx.reply("Нажаль такого препарату немає");
  }
};
export const addToNotion = async (ctx, goodRespons) => {
  try {
    await create(goodRespons);
    ctx.reply("Успішно додато в аптечку");
  } catch (err) {
    ctx.reply("Не вдалося додати у список");
    return;
  }
};
export const parseRespons = async (ctx, responseFromGPT) => {
  try {
    const parsedRespons = responseFromGPT.split("\n").filter((el) => el);
    const goodRespons = {
      parsedName: parsedRespons
        .find((el) => el.match("Назва препарату"))
        .split(":")[1],
      parsedForUse: parsedRespons.find((el) => el.match("Для")).split(":")[1],
      parsedCategory: parsedRespons
        .find((el) => el.match("Категорія"))
        .split(":")[1],
      parsedHowUse: parsedRespons
        .find((el) => el.match("Спосіб застосування"))
        .split(":")[1],
      responseFromGPT,
    };
    return goodRespons;
  } catch (err) {
    ctx.reply("Не вдалося розпізнати препарат");
    return;
  }
};
