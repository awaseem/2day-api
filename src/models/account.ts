import { Account } from "@prisma/client";
import { db } from "../lib/prisma.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function createAccount(): ReturnPromise<Account> {
  try {
    const account = await db.account.create({
      data: {},
    });

    return retData(account);
  } catch (error) {
    return retError(error);
  }
}

export async function getAccount(id: string): ReturnPromise<Account> {
  try {
    const account = await db.account.findFirst({
      where: {
        id,
      },
    });

    if (!account) {
      throw new Error("No account found");
    }

    return retData(account);
  } catch (error) {
    return retError(error);
  }
}

export async function deleteAccount(id: string): ReturnPromise<void> {
  try {
    await db.account.delete({
      where: {
        id,
      },
    });

    return retData(undefined);
  } catch (error) {
    return retError(error);
  }
}
