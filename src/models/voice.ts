const ELEVEN_LABS_URL =
  "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL";

export async function generateVoiceFromText(text: string) {
  const response = await fetch(ELEVEN_LABS_URL, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVEN_LABS_API_KEY ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.8,
      },
    }),
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(new Uint8Array(arrayBuffer));
}
