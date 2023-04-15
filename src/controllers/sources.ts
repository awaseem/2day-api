import { createSource, getAllSources } from "../models/source.js";

export async function addSource(accountId: string, url: string) {
  try {
    return createSource(accountId, url);
  } catch (error) {
    console.error("Failed to add source", error);
  }
}

export async function getSources(accountId: string) {
  try {
    return getAllSources(accountId);
  } catch (error) {
    console.error("Failed to get sources");
  }
}
