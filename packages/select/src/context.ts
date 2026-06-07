import { createContext, useContext, type RefObject } from "react";
import type { SelectStore } from "./store";

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
  };
  isControlledOpen: boolean;
  isControlledValue: boolean;
  /** Close the listbox and restore focus to the trigger. */
  close: () => void;
  /** Set value, close, and restore focus. */
  selectAndClose: (value: string) => void;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select compound components must be rendered inside <Select.Root>.");
  }
  return ctx;
}