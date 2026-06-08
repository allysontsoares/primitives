import React, { useId, useMemo, useRef, useEffect, useCallback } from "react";
import { restoreFocus } from "@kenos-ui/utils";
import { ComboboxStore } from "../store";
import { ComboboxContext } from "../context";
import type { ComboboxRootProps } from "../types";

const defaultIsItemEqualToValue = (a: string, b: string) => a === b;

function resolveLabel(
  value: string | null,
  items: Map<string, { label: string }>,
  staticItems: Record<string, string>,
): string {
  if (value == null) return "";
  return items.get(value)?.label ?? staticItems[value] ?? value;
}

export function Root(props: ComboboxRootProps) {
  const {
    children,
    value,
    defaultValue,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    disabled = false,
    required = false,
    readOnly = false,
    modal = false,
    id,
    items = {},
    isItemEqualToValue = defaultIsItemEqualToValue,
    filter,
  } = props;

  const uid = useId();
  const prefix = id ?? `cbx-${uid.replace(/:/g, "")}`;

  const ids = useMemo(
    () => ({
      root: prefix,
      label: `${prefix}-label`,
      input: `${prefix}-input`,
      trigger: `${prefix}-trigger`,
      content: `${prefix}-content`,
    }),
    [prefix],
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const isControlledValue = value !== undefined;
  const isControlledOpen = open !== undefined;
  const isControlledInputValue = inputValue !== undefined;

  const initialValue = isControlledValue ? (value ?? null) : (defaultValue ?? null);
  const initialInputValue = isControlledInputValue
    ? (inputValue ?? "")
    : (defaultInputValue ?? resolveLabel(initialValue, new Map(), items));

  const storeRef = useRef<ComboboxStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new ComboboxStore({
      value: initialValue,
      inputValue: initialInputValue,
      open: isControlledOpen ? (open ?? false) : (defaultOpen ?? false),
    });
  }
  const store = storeRef.current;

  const prevControlledValue = useRef(value);
  useEffect(() => {
    if (!isControlledValue) return;
    if (value === prevControlledValue.current) return;
    prevControlledValue.current = value;
    store.setValue(typeof value === "string" ? value : null);
  }, [isControlledValue, value, store]);

  const prevControlledInputValue = useRef(inputValue);
  useEffect(() => {
    if (!isControlledInputValue) return;
    if (inputValue === prevControlledInputValue.current) return;
    prevControlledInputValue.current = inputValue;
    store.setInputValue(inputValue ?? "");
  }, [isControlledInputValue, inputValue, store]);

  const prevControlledOpen = useRef(open);
  useEffect(() => {
    if (!isControlledOpen) return;
    if (open === prevControlledOpen.current) return;
    prevControlledOpen.current = open;
    store.setOpen(open ?? false);
  }, [isControlledOpen, open, store]);

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const prevStoreValue = useRef(store.getState().value);
  useEffect(() => {
    return store.subscribe(() => {
      const state = store.getState();
      if (state.value !== prevStoreValue.current) {
        prevStoreValue.current = state.value;
        onValueChangeRef.current?.(
          typeof state.value === "string" ? state.value : null,
        );
      }
    });
  }, [store]);

  const onInputValueChangeRef = useRef(onInputValueChange);
  onInputValueChangeRef.current = onInputValueChange;

  const prevStoreInputValue = useRef(store.getState().inputValue);
  useEffect(() => {
    return store.subscribe(() => {
      const state = store.getState();
      if (state.inputValue !== prevStoreInputValue.current) {
        prevStoreInputValue.current = state.inputValue;
        onInputValueChangeRef.current?.(state.inputValue);
      }
    });
  }, [store]);

  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const prevStoreOpen = useRef(store.getState().open);
  useEffect(() => {
    return store.subscribe(() => {
      const state = store.getState();
      if (state.open !== prevStoreOpen.current) {
        prevStoreOpen.current = state.open;
        onOpenChangeRef.current?.(state.open);
      }
    });
  }, [store]);

  const close = useCallback(() => {
    const state = store.getState();
    if (!state.open) return;
    store.setOpen(false);
    restoreFocus({
      openSource: state.openSource === "trigger" ? "trigger" : "input",
      trigger: inputRef.current ?? triggerRef.current,
    });
  }, [store]);

  const selectValue = useCallback(
    (itemValue: string) => {
      const item = store.getState().items.get(itemValue);
      const label = item?.label ?? items[itemValue] ?? itemValue;
      store.setValue(itemValue);
      store.setInputValue(label);
      close();
    },
    [store, close, items],
  );

  const clearValue = useCallback(() => {
    store.clearValue();
  }, [store]);

  const config = useMemo(
    () => ({
      disabled,
      required,
      readOnly,
      modal,
      items,
      isItemEqualToValue,
      filter: filter ?? ((item, query) => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return true;
        return (
          item.textValue.toLowerCase().includes(normalized) ||
          item.label.toLowerCase().includes(normalized)
        );
      }),
    }),
    [disabled, required, readOnly, modal, items, isItemEqualToValue, filter],
  );

  const ctx = useMemo(
    () => ({
      store,
      ids,
      refs: { inputRef, triggerRef, contentRef, listRef },
      config,
      isControlledValue,
      isControlledOpen,
      isControlledInputValue,
      onOpenChangeComplete,
      close,
      selectValue,
      clearValue,
    }),
    [
      store,
      ids,
      config,
      isControlledValue,
      isControlledOpen,
      isControlledInputValue,
      onOpenChangeComplete,
      close,
      selectValue,
      clearValue,
    ],
  );

  return <ComboboxContext.Provider value={ctx}>{children}</ComboboxContext.Provider>;
}