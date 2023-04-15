import { Account } from "@prisma/client";
import { db } from "../lib/prisma.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function createSource(
  accountId: string,
  url: string
): ReturnPromise<Account> {
  try {
    const createdPost = await db.source.create({
      data: {
        accountId,
        url,
      },
    });

    return retData(createdPost);
  } catch (error) {
    return retError(error);
  }
}

export async function getAllSources(
  accountId: string
): ReturnPromise<Account[]> {
  try {
    const sources = await db.source.findMany({
      where: {
        accountId,
      },
    });

    return retData(sources);
  } catch (error) {
    return retError(error);
  }
}

export async function deleteSource(
  accountId: string,
  sourceId: string
): ReturnPromise<void> {
  try {
    await db.source.deleteMany({
      where: {
        accountId,
        id: sourceId,
      },
    });

    return retData(undefined);
  } catch (error) {
    return retError(error);
  }
}
