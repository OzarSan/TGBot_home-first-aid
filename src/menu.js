import Markup from "telegraf/markup";
export const showMenu = (bot, chatId) => {
  bot.telegram.sendMessage(chatId, "Вибери дію:", {
    reply_markup: {
      keyboard: [
        // ["➕ Додати нові ліки", "🗂 Додати нову категорію"],
        // ["🤌 Використати ліки", "🫰 Поповнити аптечку"],
        // ["🤖 Пошук з AI", "🔍 Пошук в аптечці", "◀️ Назад"],
      ],
      resize_keyboard: true,
    },
  });
};

export const backMenu = (bot, chatId) => {
  bot.telegram.sendMessage(chatId, "Відкрий меню 🔽", {
    reply_markup: {
      remove_keyboard: true,
      keyboard: [["📱 Меню"]],
      resize_keyboard: true,
    },
  });
};

export const selectedKeyboard = async (
  bot,
  chatId,
  actionName,
  pageKeyboard
) => {
  const keyboardArray = ["◀️ Назад"];
  if (pageKeyboard !== undefined) {
    keyboardArray.push(pageKeyboard);
  }

  await bot.telegram.sendMessage(chatId, actionName, {
    reply_markup: {
      remove_keyboard: true,
      keyboard: [keyboardArray],
      resize_keyboard: true,
    },
  });
};
export function pastInlineKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback("Додати в аптечку", "addToAidKit"),
  ]);
}
