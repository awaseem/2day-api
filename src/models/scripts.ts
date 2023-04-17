import { db } from "../lib/prisma.js";

export async function createScript(
  accountId: string,
  sourceId: string,
  content: string
) {
  return db.script.create({
    data: {
      accountId,
      content,
      sourceId,
    },
  });
}

export async function getScriptsForSources(
  accountId: string,
  sources: string[]
) {
  return db.script.findMany({
    where: {
      accountId,
      sourceId: {
        in: sources,
      },
    },
    include: {
      source: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });
}

export async function getScript(accountId: string, sourceId: string) {
  return db.script.findFirst({
    where: {
      accountId,
      sourceId,
    },
    include: {
      source: {
        include: {
          sourceData: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
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

export async function updatePodcastFile(
  scriptId: string,
  podcastFileUrl: string
) {
  return db.script.update({
    data: {
      podcastFileUrl,
    },
    where: {
      id: scriptId,
    },
  });
}
