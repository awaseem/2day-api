import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

declare global {
  var ai: OpenAIApi | undefined;
}

const openAI = global.ai || new OpenAIApi(configuration);

if (process.env.NODE_ENV !== "production") global.ai = openAI;

export const ai = openAI;
