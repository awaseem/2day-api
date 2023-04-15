import { IncomingHttpHeaders } from "http";
import { Return, ReturnPromise, retData } from "../util/return.js";
import { retError } from "../util/return.js";
import { z } from "zod";
import { getAccount } from "../models/account.js";

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

export async function validateAccountId(
  headers: IncomingHttpHeaders
): ReturnPromise<Valid> {
  try {
    const accountId = headers["x-account-id"];
    if (!accountId || typeof accountId !== "string") {
      throw new Error("no account Id found");
    }

    const account = await getAccount(accountId);
    if (!account) {
      throw new Error("no account found");
    }

    return {
      data: {
        accountId: account.id,
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
