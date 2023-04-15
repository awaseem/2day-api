import { IncomingHttpHeaders } from "http";
import { Return, retData } from "../util/return.js";
import { retError } from "../util/return.js";
import { z } from "zod";

export interface Valid {
  accountId: string;
}

const CreateSourceBody = z.object({
  url: z.string().url(),
});

const CreateScriptBody = z.object({
  sourceId: z.string().uuid(),
});

const CreatePodcastBody = z.object({
  scriptId: z.string().uuid(),
});

export function validate(headers: IncomingHttpHeaders): Return<Valid> {
  try {
    const accountId = headers["x-account-id"];
    if (!accountId || typeof accountId !== "string") {
      throw new Error("no account Id found");
    }

    return {
      data: {
        accountId,
      },
    };
  } catch (error) {
    return retError(error);
  }
}

export function validCreateSource(
  body: unknown
): Return<z.infer<typeof CreateSourceBody>> {
  try {
    const res = CreateSourceBody.parse(body);
    return retData(res);
  } catch (error) {
    return retError(error);
  }
}

export function validCreateScript(
  body: unknown
): Return<z.infer<typeof CreateScriptBody>> {
  try {
    const res = CreateScriptBody.parse(body);
    return retData(res);
  } catch (error) {
    return retError(error);
  }
}

export function validCreatePodcast(
  body: unknown
): Return<z.infer<typeof CreatePodcastBody>> {
  try {
    const res = CreatePodcastBody.parse(body);
    return retData(res);
  } catch (error) {
    return retError(error);
  }
}
