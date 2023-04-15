import { convert } from "html-to-text";

export async function getTextFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const body = await response.text();

  return convert(body);
}
