import { createContext, useContext } from "react";
import type { SelectCollectionItem } from "@kenos-ui/utils";

export interface ComboboxCollectionContextValue {
  filteredItems: SelectCollectionItem[];
  enabledItems: SelectCollectionItem[];
  isEmpty: boolean;
}

export const ComboboxCollectionContext = createContext<ComboboxCollectionContextValue | null>(
  null,
);

export function useComboboxCollection(): ComboboxCollectionContextValue {
  const ctx = useContext(ComboboxCollectionContext);
  if (!ctx) {
    throw new Error(
      "Combobox collection context is missing. Render inside <Combobox.Content>.",
    );
  }
  return ctx;
}