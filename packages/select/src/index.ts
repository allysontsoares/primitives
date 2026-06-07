// packages/select/src/index.ts
// Public entry point — mirrors the pattern from package-structure.md.

export * as Select from "./index.parts";

// Named type exports for consumers that want to type individual parts.
export type { SelectRootProps, SelectContentProps, SelectItemRecord, SelectStoreState } from "./types";
export { useSelectContext } from "./context";
export type { SelectContextValue } from "./context";
