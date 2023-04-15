import Parser from "rss-parser";

declare global {
  var rss: Parser | undefined;
}

const parser = global.rss || new Parser();

if (process.env.NODE_ENV !== "production") global.rss = parser;

export const rssParser = parser;
