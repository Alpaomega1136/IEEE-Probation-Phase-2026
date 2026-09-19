import "dotenv/config";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  use: {
    baseURL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "off",
  },
  reporter: "list",
});
