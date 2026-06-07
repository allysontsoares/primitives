import { defineConfig, type Options } from "tsup";

export function createPackageTsupConfig(overrides: Options = {}): Options {
  return defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "react/jsx-runtime"],
    treeshake: true,
    splitting: false,
    ...overrides,
  });
}

export default createPackageTsupConfig();