import { Client } from "@notionhq/client";
import config from "config";

const notion = new Client({
  auth: config.get("NOTION_key"),
});

export async function create(
  name,
  text,
  parsedForUse,
  parsedCategory,
  parsedHowUse
) {
  const response = await notion.pages.create({
    parent: { database_id: config.get("NOTION_DB_ID") },
    properties: {
      Назва: {
        title: [
          {
            text: {
              content: name,
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
            name: parsedCategory[1],
            color: "brown",
          },
        ],
      },
      "Спосіб використання": {
        rich_text: [
          {
            text: { content: parsedHowUse[1] },
          },
        ],
      },
      "Для чого": {
        multi_select: [
          {
            name: parsedForUse[1],
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
                content: text,
              },
            },
          ],
        },
      },
    ],
  });
  return response;
}

export const checkDB = async (search) => {
  const retrieveDb = await notion.databases.query({
    database_id: config.get("NOTION_DB_ID"),

    filter: {
      property: "Назва",
      title: {
        contains: search,
      },
    },
  });
  return retrieveDb;
};
