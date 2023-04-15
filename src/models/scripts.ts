import { Script } from "@prisma/client";
import { db } from "../lib/prisma.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function createScript(
  accountId: string,
  content: string
): ReturnPromise<Script> {
  try {
    const script = await db.script.create({
      data: {
        accountId,
        content,
      },
    });

    return retData(script);
  } catch (error) {
    return retError(error);
  }
}

export async function getScript(
  accountId: string,
  scriptId: string
): ReturnPromise<Script> {
  try {
    const script = await db.script.findFirst({
      where: {
        accountId,
        id: scriptId,
      },
    });

    if (!script) {
      throw new Error("No script found");
    }

    return retData(script);
  } catch (error) {
    return retError(error);
  }
}

export async function deleteScript(
  accountId: string,
  scriptId: string
): ReturnPromise<void> {
  try {
    await db.script.deleteMany({
      where: {
        accountId,
        id: scriptId,
      },
    });

    return retData(undefined);
  } catch (error) {
    return retError(error);
  }
}
