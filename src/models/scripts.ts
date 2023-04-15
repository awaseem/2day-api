import { Script } from "@prisma/client";
import { db } from "../lib/prisma.js";

export async function createScript(accountId: string, content: string) {
  return db.script.create({
    data: {
      accountId,
      content,
    },
  });
}

export async function getScript(accountId: string, scriptId: string) {
  return db.script.findFirst({
    where: {
      accountId,
      id: scriptId,
    },
  });
}

export async function deleteScript(accountId: string, scriptId: string) {
  await db.script.deleteMany({
    where: {
      accountId,
      id: scriptId,
    },
  });
}
