import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      { extends: true, test: { name: "unit", environment: "node", include: ["src/**/*.test.ts"], setupFiles: ["./vitest.setup.node.ts"] } },
    ],
    env: { TZ: "UTC" },
    restoreMocks: true,
  },
});
