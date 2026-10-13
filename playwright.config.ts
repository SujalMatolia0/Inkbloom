import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "test-artifacts/playwright-report", open: "never" }]],
  outputDir: "test-artifacts/test-results",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev -- -p 3000",
        url: "http://localhost:3000",
        reuseExistingServer: false,
        timeout: 120 * 1000,
        env: {
          E2E_MODE: "true",
          DATABASE_URL: process.env.E2E_DATABASE_URL || "",
          E2E_DATABASE_URL: process.env.E2E_DATABASE_URL || "",
          SMTP_HOST: "127.0.0.1",
          SMTP_PORT: "1025",
          SMTP_USER: "",
          SMTP_PASS: "",
        },
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
