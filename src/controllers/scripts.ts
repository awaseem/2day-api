import { getTextFromUrl } from "../models/html.js";
import { parseRss } from "../models/rss.js";
import { getSource } from "../models/source.js";
import { retError } from "../util/return.js";

const MAX_ITEMS = 3;

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

    const topItems = parsedRssItems
      .slice(0, MAX_ITEMS)
      .map(item => getTextFromUrl(item.link));
    const text = await Promise.all(topItems);

    console.log(text);

    return parsedRssItems;
  } catch (error) {
    return retError(error);
  }
}
