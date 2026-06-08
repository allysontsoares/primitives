import { createContext, useContext, type RefObject } from "react";
import type { SelectCollectionFilterFn } from "@kenos-ui/utils";
import type { ComboboxStore } from "./store";
import type { ComboboxItemEqualFn } from "./types";

export interface ComboboxRefs {
  inputRef: RefObject<HTMLInputElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
}

export interface ComboboxContextValue {
  store: ComboboxStore;
  ids: {
    root: string;
    label: string;
    input: string;
    trigger: string;
    content: string;
  };
  refs: ComboboxRefs;
  config: {
    disabled: boolean;
    required: boolean;
    readOnly: boolean;
    modal: boolean;
    items: Record<string, string>;
    isItemEqualToValue: ComboboxItemEqualFn;
    filter: SelectCollectionFilterFn;
  };
  isControlledOpen: boolean;
  isControlledValue: boolean;
  isControlledInputValue: boolean;
  onOpenChangeComplete: ((open: boolean) => void) | undefined;
  /** Close the listbox and restore focus to the input. */
  close: () => void;
  /** Select a value, sync input text, and close. */
  selectValue: (value: string) => void;
  /** Clear the current selection and input text. */
  clearValue: () => void;
}

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export function useComboboxContext(): ComboboxContextValue {
  const ctx = useContext(ComboboxContext);
  if (!ctx) {
    throw new Error("Combobox compound components must be rendered inside <Combobox.Root>.");
  }
  return ctx;
}