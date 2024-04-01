import { Telegraf } from "telegraf";
const TelegramBot = require("node-telegram-bot-api");
import config from "config";
import {
  showMenu,
  backMenu,
  selectedKeyboard,
  pastInlineKeyboard,
} from "./menu.js";
import {
  responseGPT,
  searchDB,
  addToNotion,
  parseRespons,
} from "../controllers/menuControllers.js";
const botName = "home_first_aid_kit_bot";
let hearUpdateMessage = false;

const bot = new TelegramBot(config.get("TELEGRAM_TOKEN"), { polling: true });
// const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
//   handlerTimeout: Infinity,
// });

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  showMenu(bot, chatId);
});
// bot.hears("➕ Додати нові ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🗂 Додати нову категорію", (ctx) => ctx.reply("Yay!"));
// bot.hears("🤌 Використати ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🫰 Поповнити аптечку", (ctx) => ctx.reply("Yay!"));

bot.on("callback_query", async (ctx) => {
  try {
    if (ctx.callbackQuery.data === "addToAidKit") {
      const goodRespons = await parseRespons(ctx, ctx.text);
      await addToNotion(ctx, goodRespons);
      console.log(ctx.text);
    }
  } catch (err) {
    console.log("error with add to notion");
  }
});
bot.hears("🤖 Пошук з AI", async (ctx) => {
  hearUpdateMessage = true;
  const chatId = ctx.chat.id;
  const actionName = "Напиши назву препарату 🔽";
  const inlineKeyboardName = {
    header: "✅ додати в аптечку",
    callbackName: "addToAidKit",
  };
  bot.on("message", async (ctx) => {
    if (hearUpdateMessage === true) {
      try {
        const responseFromGPT = await responseGPT(ctx);
        ctx.reply(
          `${responseFromGPT.content}`,
          pastInlineKeyboard(inlineKeyboardName)
        );
      } catch (err) {
        console.log("error in bot.on");
      }
    }
    hearUpdateMessage = false;
  });
  eventEmitter.removeListener("message", bot.on);
  await selectedKeyboard(bot, chatId, actionName);
});

bot.hears("🔍 Пошук в аптечці", (ctx) => {
  hearUpdateMessage = true;
  const chatId = ctx.chat.id;
  const actionName = "Напиши назву препарату 🔽";
  selectedKeyboard(bot, chatId, actionName);
  bot.on("text", async (ctx) => {
    searchDB(bot, ctx);
  });
  bot.removeListener("text");
  eventEmitter.removeListener("text", bot.on);
});

bot.hears("📱 Меню", (ctx) => {
  const chatId = ctx.chat.id;
  showMenu(bot, chatId);
});
bot.hears("◀️ Назад", (ctx) => {
  const chatId = ctx.chat.id;
  backMenu(bot, chatId);
});

// bot.on("message", async (ctx) => {
//
//   if (ctx.message.text == "Меню") {
//     showMenu(bot, chatId);
//   }
//   if (ctx.message.text == "◀️ Назад") {
//     backMenu(bot, chatId);
//   }
//   if (ctx.message.text == "🤖 Пошук з AI") {
//     chatWithGpt(bot, chatId);
//     console.log(ctx);
//   }
// });

bot.launch();

// bot.command("start", async (ctx) => {
//   return await ctx.reply(
//     "Обери дію:",
//     Markup.keyboard([
//       ["➕ Додати нові ліки", "🗂 Додати нову категорію"], // Row1 with 2 buttons
//       ["🤌 Використати ліки", "🫰 Поповнити аптечку"], // Row2 with 2 buttons
//       ["🤖 Пошук з AI", "🔍 Пошук в аптечці"], // Row3 with 3 buttons
//     ])
//       .oneTime()
//       .resize()
//   );
// });
// bot.hears("➕ Додати нові ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🗂 Додати нову категорію", (ctx) => ctx.reply("Yay!"));
// bot.hears("🤌 Використати ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🫰 Поповнити аптечку", (ctx) => ctx.reply("Yay!"));

// bot.hears("🤖 Пошук з AI", (ctx) => {
//   ctx.reply(
//     "Введи назву ліків:",
//     Markup.keyboard([Markup.button.callback("Назад", "test")]).resize()
//   );

// });
