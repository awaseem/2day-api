import { StorageClient } from "@supabase/storage-js";

const STORAGE_URL = process.env.STORAGE_URL ?? "";
const SERVICE_KEY = process.env.SERVICE_KEY ?? "";

declare global {
  var storage: StorageClient | undefined;
}

const storageClient =
  global.storage ||
  new StorageClient(STORAGE_URL, {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  });

if (process.env.NODE_ENV !== "production") global.storage = storageClient;

export const storage = storageClient;
