import { Source } from "@prisma/client";
import {
  SourceDataType,
  createSource,
  getAllSources,
} from "../models/source.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function addSource(
  accountId: string,
  sourceData: SourceDataType[]
): ReturnPromise<Source> {
  try {
    const source = await createSource(accountId, sourceData);
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
