import { createAccount } from "../models/account.js";

export async function createNewAccount() {
  try {
    return createAccount();
  } catch (error) {
    console.error("Failed to create account", error);
  }
}
