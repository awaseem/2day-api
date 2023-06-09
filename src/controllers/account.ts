import { Account } from "@prisma/client";
import { createAccount } from "../models/account.js";
import { ReturnPromise, retData, retError } from "../util/return.js";
import { hashKey, secureUuid } from "../util/key.js";

export interface AccountApi {
  accountId: string;
  apiKey: string;
}

export async function createNewAccount(): ReturnPromise<AccountApi> {
  try {
    const apiKey = secureUuid();
    const keyHash = await hashKey(apiKey);
    const account = await createAccount(keyHash);
    return retData({ accountId: account.id, apiKey });
  } catch (error) {
    return retError(error);
  }
}
