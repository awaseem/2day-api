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

export async function getScriptsForSource(accountId: string, sourceId: string) {
  return db.script.findMany({
    where: {
      accountId,
      sourceId,
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
