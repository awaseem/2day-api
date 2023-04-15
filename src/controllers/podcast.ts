import { getScript } from "../models/scripts.js";
import { generateVoiceFromText } from "../models/voice.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function generatePodcastFromScript(
  accountId: string,
  scriptId: string
): ReturnPromise<Buffer> {
  try {
    const script = await getScript(accountId, scriptId);
    if (!script) {
      throw new Error("no script found");
    }

    const audioBuffer = await generateVoiceFromText(script.content);

    return retData(audioBuffer);
  } catch (error) {
    return retError(error);
  }
}
