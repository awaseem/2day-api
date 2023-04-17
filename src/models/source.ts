import { db } from "../lib/prisma.js";

export interface SourceDataType {
  url: string;
  type: string;
}

export async function createSource(
  accountId: string,
  sourceData: SourceDataType[]
) {
  return db.source.create({
    data: {
      accountId,
      sourceData: {
        createMany: {
          data: sourceData,
        },
      },
    },
    include: {
      sourceData: true,
    },
  });
}

export async function getAllSources(accountId: string) {
  return db.source.findMany({
    where: {
      accountId,
    },
    include: {
      sourceData: true,
    },
  });
}

export async function getSource(accountId: string, sourceId: string) {
  return db.source.findFirst({
    where: {
      accountId,
      id: sourceId,
    },
    include: {
      sourceData: true,
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
