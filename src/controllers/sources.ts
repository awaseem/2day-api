import { Source } from "@prisma/client";
import { createSource, getAllSources } from "../models/source.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function addSource(
  accountId: string,
  url: string
): ReturnPromise<Source> {
  try {
    const source = await createSource(accountId, url);
    return retData(source);
  } catch (error) {
    return retError(error);
  }
}

export async function getSources(accountId: string) {
  try {
    const sources = await getAllSources(accountId);
    return retData(sources);
  } catch (error) {
    return retError(error);
  }
}
