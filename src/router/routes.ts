import fastify from "fastify";
import { addSource, getSources } from "../controllers/sources.js";
import {
  validCreatePodcast,
  validCreateSource,
  validGetScripts,
  validateAccountId,
} from "../controllers/validation.js";
import { getScriptsFromSourceIds } from "../controllers/scripts.js";
import { addGenPodcastJob } from "../queue/podcasts.js";
import { createNewAccount } from "../controllers/account.js";

const server = fastify({ logger: true });

// Status
server.get("/status", async (_request, reply) => reply.status(200).send("👍"));

// Accounts
server.post("/v1/account", async (_request, reply) => {
  if (process.env.NODE_ENV === "production") {
    return reply.status(404).send("Not Found");
  }

  const { data, error } = await createNewAccount();
  if (error) {
    return reply.status(500).send(error.message);
  }

  return reply.status(200).send(data);
});

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
