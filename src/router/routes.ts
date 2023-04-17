import fastify from "fastify";
import { addSource, getSources } from "../controllers/sources.js";
import {
  validCreatePodcast,
  validCreateSource,
  validGetScript,
  validateAccountId,
} from "../controllers/validation.js";
import { getScriptFromSourceId } from "../controllers/scripts.js";
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
  try {
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
  } catch (error) {
    console.error(error);
    throw error;
  }
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
server.get("/v1/script/:sourceId", async (request, reply) => {
  const { headers, params } = request;

  const { data: account, error: accountError } = await validateAccountId(
    headers
  );
  if (accountError) {
    reply.status(400).send({ message: accountError.message });
    return;
  }

  const { data: getScriptsBody, error: getScriptsError } =
    validGetScript(params);
  if (getScriptsError) {
    reply.status(400).send({ message: getScriptsError.message });
    return;
  }

  const script = await getScriptFromSourceId(
    account.accountId,
    getScriptsBody.sourceId
  );

  return reply.status(200).send(script);
});

server.post("/v1/script", async (request, reply) => {
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
