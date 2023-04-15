import { Script } from "@prisma/client";
import { createPodcastScript, summarizeText } from "../models/ai.js";
import { parseRss } from "../models/rss.js";
import { createScript } from "../models/scripts.js";
import { getSource } from "../models/source.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

const MAX_ITEMS = 5;

export async function getSummaryFromLink(link: string) {
  const summary = await summarizeText(link);
  return summary;
}

export async function generateScriptForSource(
  accountId: string,
  sourceId: string
): ReturnPromise<Script> {
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

    const content = await createPodcastScript(cleanSummaries);
    if (!content) {
      throw new Error("Failed to create script");
    }

    const script = await createScript(accountId, content);

    return retData(script);
  } catch (error) {
    return retError(error);
  }
}
