export function sanitizeString(content: string): string {
  return content.replaceAll("\n", "").replaceAll('"', "");
}
