import { StorageClient } from "@supabase/storage-js";

const STORAGE_URL = process.env.STORAGE_URL ?? "";
const SERVICE_KEY = process.env.SERVICE_KEY ?? "";

export const storage = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});
