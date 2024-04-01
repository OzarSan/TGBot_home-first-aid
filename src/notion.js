import { Client } from "@notionhq/client";
import config from "config";

const notion = new Client({
  auth: config.get("NOTION_key"),
});

export async function create(goodRespons) {
  const response = await notion.pages.create({
    parent: { database_id: config.get("NOTION_DB_ID") },
    properties: {
      Назва: {
        title: [
          {
            text: {
              content: goodRespons.parsedName,
            },
          },
        ],
      },
      "Дата додавання": {
        date: {
          start: new Date().toISOString(),
        },
      },
      Категорія: {
        multi_select: [
          {
            name: goodRespons.parsedCategory,
            color: "brown",
          },
        ],
      },
      "Спосіб використання": {
        rich_text: [
          {
            text: { content: goodRespons.parsedHowUse },
          },
        ],
      },
      "Для чого": {
        multi_select: [
          {
            name: goodRespons.parsedForUse,
            color: "brown",
          },
        ],
      },
    },
  });

  await notion.blocks.children.append({
    block_id: response.id,
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: goodRespons.responseFromGPT,
              },
            },
          ],
        },
      },
    ],
  });
  return response;
}

export const checkDB = async (searchWord) => {
  const retrieveDb = await notion.databases.query({
    database_id: config.get("NOTION_DB_ID"),

    filter: {
      property: "Назва",
      title: {
        contains: searchWord,
      },
    },
  });
  return retrieveDb;
};
