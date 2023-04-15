import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const SALT_ROUNDS = 10;

export function secureUuid() {
  return uuid();
}

export async function hashKey(key: string = secureUuid()) {
  const hash = await bcrypt.hash(key, SALT_ROUNDS);
  return hash;
}

export async function isValidKey(key: string, hash: string) {
  return bcrypt.compare(key, hash);
}
