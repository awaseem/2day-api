import Queue from "bull";
import { generatePodcastFromSourceId } from "../controllers/podcast.js";

const QUEUE_NAME = "podcasts";

const podcastQueue = new Queue(QUEUE_NAME, {
  redis: {
    host: process.env.REDIS_URL ?? "",
    port: parseInt(process.env.REDIS_PORT ?? "0"),
    password: process.env.REDIS_PASSWORD ?? "",
    tls: {},
  },
});

export interface GenPodcastJob {
  accountId: string;
  sourceId: string;
}

export async function addGenPodcastJob(accountId: string, sourceId: string) {
  await podcastQueue.add({
    accountId,
    sourceId,
  });
}

podcastQueue.process(async (job, done) => {
  const { accountId, sourceId } = job.data as GenPodcastJob;

  const { error } = await generatePodcastFromSourceId(accountId, sourceId);
  if (error) {
    done(error);
    return;
  }

  done();
});
