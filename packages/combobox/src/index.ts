// packages/combobox/src/index.ts
// Public entry point — mirrors the pattern from package-structure.md.

export * as Combobox from "./index.parts";

// Named type exports for consumers that want to type individual parts.
export type {
  ComboboxRootProps,
  ComboboxContentProps,
  ComboboxItemRecord,
  ComboboxStoreState,
  ComboboxClearProps,
} from "./types";
export { useComboboxContext } from "./context";
export type { ComboboxContextValue } from "./context";
export { ComboboxStore, useComboboxStore } from "./store";