import { Script } from "@prisma/client";
import { uploadBuffer } from "../models/file.js";
import { getScript, updatePodcastFile } from "../models/scripts.js";
import { generateVoiceFromText } from "../models/voice.js";
import { ReturnPromise, retData, retError } from "../util/return.js";
import { generateScriptForSource } from "./scripts.js";
import { error } from "console";

export async function generatePodcastFromSourceId(
  accountId: string,
  sourceId: string
): ReturnPromise<Script> {
  try {
    const { data: script, error: scriptError } = await generateScriptForSource(
      accountId,
      sourceId
    );
    if (scriptError) {
      throw scriptError;
    }

    const scriptId = script.id;

    const audioBuffer = await generateVoiceFromText(script.content);
    const filePath = await uploadBuffer(scriptId, audioBuffer);
    const updatedScript = await updatePodcastFile(scriptId, filePath);

    return retData(updatedScript);
  } catch (error) {
    return retError(error);
  }
}
