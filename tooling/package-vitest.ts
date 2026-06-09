import { defineConfig, mergeConfig, type UserConfig } from "vitest/config";

const baseConfig = defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["**/*.stories.tsx", "tests/**", "dist/**"],
    },
  },
});

export function createPackageVitestConfig(overrides: UserConfig = {}): UserConfig {
  return mergeConfig(baseConfig, overrides);
}

export default baseConfig;
