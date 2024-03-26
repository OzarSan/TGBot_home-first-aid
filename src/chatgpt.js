import OpenAI from "openai";
import config from "config";

const CHATGPT_MODEL = "gpt-3.5-turbo";
const ROLES = {
  ASSISTANT: "assistant",
  SYSTEM: "system",
  USER: "user",
};

const openai = new OpenAI({
  apiKey: config.get("OPENAI_key"),
});

const getMessage = (m) =>
  `Напиши коротко діючі речовини, категорію та спосіб застосування ${m}`;
export async function chatGPT(message = "") {
  const messages = [
    {
      role: ROLES.SYSTEM,
      content:
        "Ти досвідчений фармацепт, який допомагає людям знаходити правильні ліки на сайті tabletki.ua",
    },
    {
      role: ROLES.USER,
      content: getMessage(message),
    },
  ];
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    });
    return chatCompletion.choices[0].message;
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  }
}
