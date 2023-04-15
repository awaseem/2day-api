import { rssParser } from "../lib/rss.js";

export interface ParsedRSSItem {
  link: string;
}

export async function parseRss(url: string): Promise<ParsedRSSItem[]> {
  const { items } = await rssParser.parseURL(url);

  const parsedRssItems = items
    .filter(item => item.link)
    .map(item => ({ link: item.link }));

  return parsedRssItems as ParsedRSSItem[];
}
