import { storage } from "../lib/storage.js";

const BUCKET_NAME = process.env.BUCKET_NAME ?? "";

export async function uploadBuffer(scriptId: string, buffer: Buffer) {
  const fileName = `${scriptId}.mp3`;

  const { data, error } = await storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: "audio/mpeg",
    });
  if (error) {
    throw error;
  }

  return data.path;
}
