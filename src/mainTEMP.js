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
// bot.hears("➕ Додати нові ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🗂 Додати нову категорію", (ctx) => ctx.reply("Yay!"));
// bot.hears("🤌 Використати ліки", (ctx) => ctx.reply("Yay!"));
// bot.hears("🫰 Поповнити аптечку", (ctx) => ctx.reply("Yay!"));
// bot.hears("✅ додати в аптечку", async (ctx) => {
//   await addToNotion(ctx);
// });

bot.action("addToAidKit", (ctx) => {
  if (ctx.callbackQuery.data === "addToAidKit") {
    console.log(ctx.session);
    ctx.editMessageText("Ваша задача успешно добавлена");
  } else {
    ctx.deleteMessage();
  }
});
bot.hears("🤖 Пошук з AI", async (ctx) => {
  const chatId = ctx.chat.id;
  const actionName = "Напиши назву препарату 🔽";

  bot.on("text", async (ctx) => {
    try {
      const responseFromGPT = await responseGPT(bot, ctx);
      ctx.reply(`${responseFromGPT.content}`, pastInlineKeyboard());
      const chatId = ctx.chat.id;
      const pageKeyboard = "✅ додати в аптечку";
      const actionName = "Вибери дію: 🔽";

      await addToNotion(ctx, responseFromGPT);
    } catch (err) {
      console.log("error in bot.on");
    }
  });
  await selectedKeyboard(bot, chatId, actionName);
});

bot.hears("🔍 Пошук в аптечці", (ctx) => {
  const chatId = ctx.chat.id;
  const actionName = "Напиши назву препарату 🔽";
  selectedKeyboard(bot, chatId, actionName);
  bot.on("text", async (ctx) => {
    try {
      await searchDB(ctx);
    } catch (err) {}
  });
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
