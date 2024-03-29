import { Telegraf } from "telegraf";
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
} from "../controllers/menuControllers.js";
const botName = "home_first_aid_kit_bot";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
  handlerTimeout: Infinity,
});

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  showMenu(bot, chatId);
});
bot.on("callback_query", async (ctx) => {
  console.log(ctx);
});
// bot.hears("➕ Додати нові ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🗂 Додати нову категорію", (ctx) => ctx.reply("Yay!"));
// bot.hears("🤌 Використати ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🫰 Поповнити аптечку", (ctx) => ctx.reply("Yay!"));
// bot.hears("✅ додати в аптечку", async (ctx) => {
//   await addToNotion(ctx);
// });

// bot.hears("🤖 Пошук з AI", async (ctx) => {
//   const chatId = ctx.chat.id;
//   const actionName = "Напиши назву препарату 🔽";

//   bot.on("text", async (ctx) => {
//     try {
//       const responseFromGPT = await responseGPT(bot, ctx);
//       ctx.reply(`${responseFromGPT.content}`, pastInlineKeyboard());
//       const chatId = ctx.chat.id;
//       const pageKeyboard = "✅ додати в аптечку";
//       const actionName = "Вибери дію: 🔽";

//       await addToNotion(ctx, responseFromGPT);
//     } catch (err) {
//       console.log("error in bot.on");
//     }
//   });
//   await selectedKeyboard(bot, chatId, actionName);
// });

// bot.hears("🔍 Пошук в аптечці", (ctx) => {
//   const chatId = ctx.chat.id;
//   const actionName = "Напиши назву препарату 🔽";
//   selectedKeyboard(bot, chatId, actionName);
//   bot.on("text", async (ctx) => {
//     try {
//       await searchDB(ctx);
//     } catch (err) {}
//   });
// });

// bot.hears("📱 Меню", (ctx) => {
//   const chatId = ctx.chat.id;
//   showMenu(bot, chatId);
// });
// bot.hears("◀️ Назад", (ctx) => {
//   const chatId = ctx.chat.id;
//   backMenu(bot, chatId);
// });

bot.launch();
