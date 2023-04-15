import { IncomingHttpHeaders } from "http";
import { Return, ReturnPromise, retData } from "../util/return.js";
import { retError } from "../util/return.js";
import { z } from "zod";
import { getAccount } from "../models/account.js";
import { getSource } from "../models/source.js";
import { Source } from "@prisma/client";
import { isValidKey } from "../util/key.js";

export interface Valid {
  accountId: string;
}

const CreateSourceBody = z.object({
  url: z.string().url(),
});

const GetScriptsBody = z.object({
  sourceIds: z.array(z.string().uuid()),
});

const CreatePodcastBody = z.object({
  sourceId: z.string().uuid(),
});

export async function validateAccountId(
  headers: IncomingHttpHeaders
): ReturnPromise<Valid> {
  try {
    const accountId = headers["x-account-id"];
    if (!accountId || typeof accountId !== "string") {
      throw new Error("no account id found");
    }
    const apiKey = headers["x-account-api-key"];
    if (!apiKey || typeof apiKey !== "string") {
      throw new Error("no account api key found");
    }

    const account = await getAccount(accountId);
    if (!account) {
      throw new Error("no account found");
    }

    const isValid = await isValidKey(apiKey, account.apiKey);
    if (!isValid) {
      throw new Error("invalid");
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

export function validGetScripts(
  body: unknown
): Return<z.infer<typeof GetScriptsBody>> {
  try {
    const res = GetScriptsBody.parse(body);
    return retData(res);
  } catch (error) {
    return retError(error);
  }
}

export async function validCreatePodcast(
  accountId: string,
  body: unknown
): ReturnPromise<Source> {
  try {
    const res = CreatePodcastBody.parse(body);

    const source = await getSource(accountId, res.sourceId);
    if (!source) {
      throw new Error("no source found");
    }

    return retData(source);
  } catch (error) {
    return retError(error);
  }
}
