import { Script } from "@prisma/client";
import { createPodcastScript } from "../models/ai.js";
import { parseRss } from "../models/rss.js";
import {
  createScript,
  getScript,
  getScriptsForSources,
} from "../models/scripts.js";
import { getSource } from "../models/source.js";
import { ReturnPromise, retData, retError } from "../util/return.js";
import { sanitizeString } from "../util/sanitize.js";

const MAX_ITEMS = 3;

export async function getScriptFromSourceId(
  accountId: string,
  sourceIds: string
) {
  try {
    const scriptWithSource = await getScript(accountId, sourceIds);

    return retData(scriptWithSource);
  } catch (error) {
    return retError(error);
  }
}

export async function getScriptsFromSourceIds(
  accountId: string,
  sourceIds: string[]
) {
  try {
    const scriptsWithSources = await getScriptsForSources(accountId, sourceIds);

    return retData(scriptsWithSources);
  } catch (error) {
    return retError(error);
  }
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

    const links = parsedRssItems.map(item => item.link).splice(0, MAX_ITEMS);

    const content = await createPodcastScript(links);
    if (!content) {
      throw new Error("Failed to create script");
    }

    const cleanContent = sanitizeString(content);
    const script = await createScript(accountId, sourceId, cleanContent);

    return retData(script);
  } catch (error) {
    return retError(error);
  }
}
