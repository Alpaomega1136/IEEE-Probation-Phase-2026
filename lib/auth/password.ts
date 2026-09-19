import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export function hashPassword(password: string) {
  if (new TextEncoder().encode(password).length > 72) {
    throw new Error("Password must not exceed 72 UTF-8 bytes");
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  if (new TextEncoder().encode(password).length > 72)
    return Promise.resolve(false);
  return bcrypt.compare(password, hash);
}
