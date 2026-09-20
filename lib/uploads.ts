import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { AppError } from "@/lib/errors/app-error";

const directory = join(process.cwd(), ".local", "uploads");
const fileNamePattern = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;
const formats = {
  "image/jpeg": {
    ext: "jpg",
    matches: (b: Buffer) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  "image/png": {
    ext: "png",
    matches: (b: Buffer) =>
      b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  "image/webp": {
    ext: "webp",
    matches: (b: Buffer) =>
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
} as const;

export async function saveUpload(file: File) {
  if (!file.size || file.size > 5 * 1024 * 1024)
    throw new AppError(
      "VALIDATION_ERROR",
      "Choose an image smaller than 5 MB.",
      400,
    );
  const format = formats[file.type as keyof typeof formats];
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!format || !format.matches(bytes))
    throw new AppError(
      "VALIDATION_ERROR",
      "Use a JPEG, PNG, or WebP image.",
      400,
    );
  const name = `${randomUUID()}.${format.ext}`;
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, name), bytes, { flag: "wx" });
  return `/api/uploads/${name}`;
}

export async function readUpload(name: string) {
  if (!fileNamePattern.test(name)) return null;
  try {
    return await readFile(join(directory, name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function removeUpload(url: string | null | undefined) {
  const name = url?.split("/api/uploads/")[1];
  if (!name || !url?.startsWith("/api/uploads/") || !fileNamePattern.test(name))
    return;
  try {
    await unlink(join(directory, name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
