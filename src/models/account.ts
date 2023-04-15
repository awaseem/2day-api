import { db } from "../lib/prisma.js";

export async function createAccount(apiKeyHash: string) {
  return db.account.create({
    data: {
      apiKey: apiKeyHash,
    },
  });
}

export async function getAccount(id: string) {
  return db.account.findFirst({
    where: {
      id,
    },
  });
}

export async function deleteAccount(id: string) {
  await db.account.delete({
    where: {
      id,
    },
  });
}
