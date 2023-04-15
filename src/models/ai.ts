import { ai } from "../lib/ai.js";

const SUMMARIZE_TEXT_CONTENT =
  "You take a text representation of html pages and generate a summary based on the content, ignore any headers and menu items. Make sure the summary is simple, and any words that the general population might not understand should be explained in detail. Fill in any background details about any public figures, companies or places mentioned in the article.";

const CREATE_PODCAST_CONTENT =
  "Create a podcast episode describing the following summaries. The host for the podcast is Mayo. Make the output text only without any cues for music. Remove any callouts for the title and when Mayo is suppose to speak. Exclude any newline characters and ensure the output is less the 2500 characters.";

export async function summarizeText(text: string) {
  const completion = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: SUMMARIZE_TEXT_CONTENT },
      { role: "user", content: `summarize the following: ${text}` },
    ],
  });

  return completion.data.choices.at(0)?.message?.content;
}

export async function createPodcastScript(summaries: string[]) {
  const completion = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 1.2,
    messages: [
      {
        role: "user",
        content: `${CREATE_PODCAST_CONTENT}\n${summaries
          .map(summary => `Summary: ${summary}`)
          .join("\n")}`,
      },
    ],
  });

  return completion.data.choices.at(0)?.message?.content;
}
