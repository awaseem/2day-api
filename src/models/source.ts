import { Source } from "@prisma/client";
import { db } from "../lib/prisma.js";

export async function createSource(accountId: string, url: string) {
  return db.source.create({
    data: {
      accountId,
      url,
    },
  });
}

export async function getAllSources(accountId: string) {
  return db.source.findMany({
    where: {
      accountId,
    },
  });
}

export async function getSource(accountId: string, sourceId: string) {
  return db.source.findFirst({
    where: {
      accountId,
      id: sourceId,
    },
  });
}

export async function deleteSource(accountId: string, sourceId: string) {
  await db.source.deleteMany({
    where: {
      accountId,
      id: sourceId,
    },
  });
}
