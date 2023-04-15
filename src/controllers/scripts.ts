import { createPodcastScript, summarizeText } from "../models/ai.js";
import { getTextFromUrl } from "../models/html.js";
import { parseRss } from "../models/rss.js";
import { getSource } from "../models/source.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

const MAX_ITEMS = 3;

export async function getSummaryFromLink(link: string) {
  const text = await getTextFromUrl(link);
  const summary = await summarizeText(text);

  return summary;
}

export async function generateScriptForSource(
  accountId: string,
  sourceId: string
): ReturnPromise<string> {
  try {
    const source = await getSource(accountId, sourceId);
    if (!source) {
      throw new Error("Failed to find source");
    }

    const parsedRssItems = await parseRss(source.url);

    const topSummaries = await Promise.all(
      parsedRssItems
        .slice(0, MAX_ITEMS)
        .map(item => getSummaryFromLink(item.link))
    );
    const cleanSummaries = topSummaries.filter(Boolean) as string[];

    const script = await createPodcastScript(cleanSummaries);
    if (!script) {
      throw new Error("Failed to create script");
    }

    return retData(script);
  } catch (error) {
    return retError(error);
  }
}
