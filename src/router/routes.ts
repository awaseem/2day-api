import fastify from "fastify";
import { addSource, getSources } from "../controllers/sources.js";
import {
  validCreatePodcast,
  validCreateSource,
  validGetScripts,
  validateAccountId,
} from "../controllers/validation.js";
import { getScriptsFromSourceIds } from "../controllers/scripts.js";
import { generatePodcastFromSourceId } from "../controllers/podcast.js";
import { addGenPodcastJob } from "../queue/podcasts.js";

const server = fastify({ logger: true });

// Sources
server.get("/v1/sources", async (request, reply) => {
  const { headers } = request;
  const { data: validData, error: validateError } = await validateAccountId(
    headers
  );
  if (validateError) {
    reply.status(400).send({ message: validateError.message });
    return;
  }

  const { data, error } = await getSources(validData.accountId);
  if (error) {
    reply.status(500).send({ message: error.message });
    return;
  }

  reply.status(200).send({ data });
});

server.post("/v1/source", async (request, reply) => {
  const { headers, body } = request;

  const { data: validHeaders, error: headerError } = await validateAccountId(
    headers
  );
  if (headerError) {
    reply.status(400).send({ message: headerError.message });
    return;
  }

  const { data: validSourceBody, error: createSourceError } =
    validCreateSource(body);
  if (createSourceError) {
    reply.status(400).send({ message: createSourceError.message });
    return;
  }

  const { data, error } = await addSource(
    validHeaders.accountId,
    validSourceBody.url
  );
  if (error) {
    reply.status(500).send({ message: error.message });
    return;
  }

  reply.status(200).send(data);
});

// Scripts
server.post("/v1/scripts", async (request, reply) => {
  const { headers, body } = request;

  const { data: account, error: accountError } = await validateAccountId(
    headers
  );
  if (accountError) {
    reply.status(400).send({ message: accountError.message });
    return;
  }

  const { data: getScriptsBody, error: getScriptsError } =
    validGetScripts(body);
  if (getScriptsError) {
    reply.status(400).send({ message: getScriptsError.message });
    return;
  }

  const scripts = await getScriptsFromSourceIds(
    account.accountId,
    getScriptsBody.sourceIds
  );

  return reply.status(200).send(scripts);
});

// Podcast
server.post("/v1/podcast", async (request, reply) => {
  const { headers, body } = request;

  const { data: account, error: accountError } = await validateAccountId(
    headers
  );
  if (accountError) {
    reply.status(400).send({ message: accountError.message });
    return;
  }

  const { accountId } = account;
  const { data: validSource, error: sourceError } = await validCreatePodcast(
    accountId,
    body
  );
  if (sourceError) {
    reply.status(400).send({ message: sourceError.message });
    return;
  }

  await addGenPodcastJob(accountId, validSource.id);
  return reply.status(200).send({ message: "Job started 🚀" });
});

export const api = server;
