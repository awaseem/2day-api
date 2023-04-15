import { parseRss } from "../models/rss.js";
import { getSource } from "../models/source.js";

export async function generateScriptForSource(
  accountId: string,
  sourceId: string
) {
  try {
    const source = await getSource(accountId, sourceId);
    if (!source) {
      throw new Error("Failed to find source");
    }

    const parsedRssItems = await parseRss(source.url);

    return parsedRssItems;
  } catch (error) {
    console.error("Failed to generate script for source", error);
  }
}
