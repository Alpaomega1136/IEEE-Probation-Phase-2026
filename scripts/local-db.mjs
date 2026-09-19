import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

const root = resolve(import.meta.dirname, "..");
const local = join(root, ".local");
const data = join(local, "postgres");
const envPath = join(root, ".env");
const windows = process.platform === "win32";
let bin = process.env.PGBIN;
if (!bin && windows) {
  const result = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      "(Get-CimInstance Win32_Service | Where-Object Name -Like 'postgresql*' | Select-Object -First 1).PathName",
    ],
    { encoding: "utf8", windowsHide: true },
  );
  const executable = result.stdout?.match(/^\s*"([^"]+pg_ctl\.exe)"/i)?.[1];
  if (executable) bin = dirname(executable);
}
function run(name, args, env = {}) {
  const command = bin ? join(bin, name + (windows ? ".exe" : "")) : name;
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
    env: { ...process.env, ...env },
  });
  if (result.error || result.status !== 0)
    throw new Error(
      `${name} failed. Install PostgreSQL or set PGBIN to its bin directory.`,
    );
}
if (process.argv[2] === "stop") {
  if (existsSync(join(data, "postmaster.pid")))
    run("pg_ctl", ["-D", data, "-m", "fast", "-w", "stop"]);
  process.exit(0);
}
mkdirSync(local, { recursive: true });
if (!existsSync(envPath)) {
  const dbPassword = randomBytes(24).toString("hex");
  const adminPassword = randomBytes(12).toString("base64url");
  writeFileSync(
    envPath,
    [
      `DATABASE_URL="postgresql://ieee_local:${dbPassword}@127.0.0.1:5433/ieee_events?schema=public"`,
      `AUTH_SECRET="${randomBytes(48).toString("hex")}"`,
      'NEXTAUTH_URL="http://localhost:3000"',
      'SEED_ADMIN_NAME="IEEE Admin"',
      'SEED_ADMIN_EMAIL="admin@example.com"',
      `SEED_ADMIN_PASSWORD="${adminPassword}"`,
      "",
    ].join("\n"),
    { mode: 0o600 },
  );
}
const config = parse(readFileSync(envPath));
const url = new URL(config.DATABASE_URL);
if (
  url.hostname !== "127.0.0.1" ||
  url.port !== "5433" ||
  url.username !== "ieee_local"
) {
  throw new Error(
    "Existing .env points to another database. Use that database with npm run db:deploy; .env was left unchanged.",
  );
}
if (!existsSync(join(data, "PG_VERSION"))) {
  const passwordFile = join(local, "init-password");
  writeFileSync(passwordFile, decodeURIComponent(url.password), {
    mode: 0o600,
  });
  try {
    run("initdb", [
      "-D",
      data,
      "-U",
      "ieee_local",
      "--pwfile",
      passwordFile,
      "--auth=scram-sha-256",
      "--encoding=UTF8",
      "--locale=C",
    ]);
  } finally {
    unlinkSync(passwordFile);
  }
}
if (!existsSync(join(data, "postmaster.pid")))
  run("pg_ctl", [
    "-D",
    data,
    "-l",
    join(local, "postgres.log"),
    "-o",
    "-p 5433 -h 127.0.0.1",
    "-w",
    "start",
  ]);
const dbEnv = { PGPASSWORD: decodeURIComponent(url.password) };
const psqlArgs = [
  "-h",
  "127.0.0.1",
  "-p",
  "5433",
  "-U",
  "ieee_local",
  "-d",
  "postgres",
  "-v",
  "ON_ERROR_STOP=1",
];
const check = spawnSync(
  bin ? join(bin, windows ? "psql.exe" : "psql") : "psql",
  [
    ...psqlArgs,
    "-tAc",
    "SELECT 1 FROM pg_database WHERE datname='ieee_events'",
  ],
  { encoding: "utf8", windowsHide: true, env: { ...process.env, ...dbEnv } },
);
if (check.status !== 0)
  throw new Error("Could not connect to the project database.");
if (check.stdout.trim() !== "1")
  run("psql", [...psqlArgs, "-c", "CREATE DATABASE ieee_events"], dbEnv);
console.log(
  "Local PostgreSQL is ready on 127.0.0.1:5433. Credentials are in the ignored .env file.",
);
