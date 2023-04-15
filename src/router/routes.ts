import fastify from "fastify";
import { createNewAccount } from "../controllers/account.js";
import { addSource, getSources } from "../controllers/sources.js";
import {
  validCreatePodcast,
  validCreateScript,
  validCreateSource,
  validate,
} from "../controllers/validation.js";
import { generateScriptForSource } from "../controllers/scripts.js";
import { generatePodcastFromScript } from "../controllers/podcast.js";

const server = fastify({ logger: true });

// Accounts
server.post("/v1/account", async (request, reply) => {
  const { data, error } = await createNewAccount();
  if (error) {
    reply.status(500).send({});
    return;
  }

  reply.status(200).send(data);
});

// Sources
server.get("/v1/sources", async (request, reply) => {
  const { headers } = request;
  const { data: validData, error: validateError } = validate(headers);
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

  const { data: validHeaders, error: headerError } = validate(headers);
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
server.post("/v1/script", async (request, reply) => {
  const { headers, body } = request;

  const { data: validHeaders, error: headerError } = validate(headers);
  if (headerError) {
    reply.status(400).send({ message: headerError.message });
    return;
  }

  const { data: validScriptBody, error: createScriptError } =
    validCreateScript(body);
  if (createScriptError) {
    reply.status(400).send({ message: createScriptError.message });
    return;
  }

  const { data, error } = await generateScriptForSource(
    validHeaders.accountId,
    validScriptBody.sourceId
  );
  if (error) {
    reply.status(500).send({ message: error.message });
    return;
  }

  reply.status(200).send(data);
});

// Podcast
server.post("/v1/podcast", async (request, reply) => {
  const { headers, body } = request;

  const { data: validHeaders, error: headerError } = validate(headers);
  if (headerError) {
    reply.status(400).send({ message: headerError.message });
    return;
  }

  const { data: validPodcastBody, error: createPodcastError } =
    validCreatePodcast(body);
  if (createPodcastError) {
    reply.status(400).send({ message: createPodcastError.message });
    return;
  }

  const { data, error } = await generatePodcastFromScript(
    validHeaders.accountId,
    validPodcastBody.scriptId
  );
  if (error) {
    reply.status(500).send({ message: error.message });
    return;
  }

  return reply.type("audio/mpeg").send(data);
});

export const api = server;
