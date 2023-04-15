import { rssParser } from "../lib/rss.js";

export interface ParsedRSSItem {
  title: string;
  link: string;
}

export async function parseRss(url: string): Promise<ParsedRSSItem[]> {
  const { items } = await rssParser.parseURL(url);

  const parsedRssItems = items
    .filter(item => item.link && item.title)
    .map(item => ({ link: item.link, title: item.title }));

  return parsedRssItems as ParsedRSSItem[];
}
