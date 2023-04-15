import { ai } from "../lib/ai.js";

const SUMMARIZE_TEXT_CONTENT =
  "You take a text representation of html pages and generate a summary based on the content, ignore any headers and menu items. Make sure the summary is simple, and any words that the general population might not understand should be explained in detail. Fill in any background details about any public figures, companies or places mentioned in the article.";

const CREATE_PODCAST_CONTENT =
  "Summarize the article in each link, the links are of format Link: ${url of article}. Then take all those summaries and create a podcast episode that is exactly 2500 characters. The host for the podcast is Jane, ensure Jane greets the audience and closes the show. Make the output text only without any cues for music. Remove any callouts of when Jane is suppose to speak.";

export async function createPodcastScript(links: string[]) {
  const completion = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 1.2,
    messages: [
      {
        role: "user",
        content: `${CREATE_PODCAST_CONTENT}\n${links
          .map(link => `Link: ${link}`)
          .join("\n")}`,
      },
    ],
  });

  return completion.data.choices.at(0)?.message?.content;
}
