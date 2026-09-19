import "dotenv/config";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { chromium } from "@playwright/test";

async function availablePort() {
  const listener = createServer();
  await new Promise((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", resolve);
  });
  const port = listener.address().port;
  await new Promise((resolve) => listener.close(resolve));
  return port;
}

const base = `http://localhost:${await availablePort()}`;
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--port", new URL(base).port],
  {
    env: {
      ...process.env,
      DATABASE_URL: `postgresql://unavailable:invalid@127.0.0.1:${await availablePort()}/missing?connect_timeout=1`,
      NEXTAUTH_URL: base,
    },
    windowsHide: true,
    stdio: "ignore",
  },
);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null)
      throw new Error("Run npm run build before the recovery test.");
    try {
      await fetch(`${base}/api/auth/providers`);
      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  assert.ok(ready, "Production server did not become ready");
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/events`);
  await page
    .getByRole("heading", { name: "Unable to load this page" })
    .waitFor();
  await page.getByRole("button", { name: "Try again" }).click();
  await page
    .getByRole("heading", { name: "Unable to load this page" })
    .waitFor();
  const response = await fetch(`${base}/api/events`);
  assert.equal(response.status, 500);
  const body = await response.json();
  assert.equal(body.error.code, "INTERNAL_ERROR");
  assert.doesNotMatch(JSON.stringify(body), /postgresql|prisma|password/i);
  await page.screenshot({
    path: ".local/screenshots/database-error-mobile.png",
    fullPage: true,
  });
  await page.goto(`${base}/admin/login`);
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("test-only-password");
  const callback = page.waitForResponse((value) =>
    value.url().includes("/api/auth/callback/credentials"),
  );
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  const authBody = await (await callback).text();
  assert.doesNotMatch(
    decodeURIComponent(authBody),
    /postgresql|prisma|password|Can't reach database|127\.0\.0\.1/i,
  );
  await page.locator(".login-form [role=alert]").waitFor();
  console.log(
    "Recovery passed: public error/retry, safe event API errors, and safe authentication errors.",
  );
} finally {
  await browser?.close();
  server.kill();
}
