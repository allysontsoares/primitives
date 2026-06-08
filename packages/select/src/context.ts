import { createContext, useContext, type RefObject } from "react";
import type { SelectStore } from "./store";
import type { SelectItemEqualFn, ScrollToIndexOptions } from "./types";

export interface SelectRefs {
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
}

export interface SelectContextValue {
  store: SelectStore;
  ids: {
    root: string;
    label: string;
    trigger: string;
    content: string;
  };
  refs: SelectRefs;
  config: {
    disabled: boolean;
    required: boolean;
    readOnly: boolean;
    modal: boolean;
    name: string | undefined;
    multiple: boolean;
    items: Record<string, string>;
    isItemEqualToValue: SelectItemEqualFn;
    openOnFocus: boolean;
  };
  isControlledOpen: boolean;
  isControlledValue: boolean;
  onOpenChangeComplete: ((open: boolean) => void) | undefined;
  /** Close the listbox and restore focus to the trigger. */
  close: () => void;
  /** Select a value (toggle in multiple mode, set + close in single mode). */
  selectValue: (value: string) => void;
  /** Alias for selectValue — kept for backward compatibility. */
  selectAndClose: (value: string) => void;
  /** Clear the current selection. */
  clearValue: () => void;
  /** Scroll the list to the item at the given index. */
  scrollToIndex: (index: number, options?: ScrollToIndexOptions) => void;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select compound components must be rendered inside <Select.Root>.");
  }
  return ctx;
}