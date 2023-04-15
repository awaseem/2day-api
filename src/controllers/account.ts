import { Account } from "@prisma/client";
import { createAccount } from "../models/account.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function createNewAccount(): ReturnPromise<Account> {
  try {
    const account = await createAccount();
    return retData(account);
  } catch (error) {
    return retError(error);
  }
}
