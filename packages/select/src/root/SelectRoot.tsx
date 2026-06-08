import React, { useId, useMemo, useRef, useEffect, useCallback } from "react";
import { restoreFocus } from "@kenos-ui/utils";
import { SelectStore } from "../store";
import { SelectContext } from "../context";
import type { SelectRootProps } from "../types";
import { extractItemsFromChildren } from "../utils/extract-items";
import { scrollToIndexInState } from "../utils/scroll-to-index";
import type { ScrollToIndexOptions } from "../types";

const defaultIsItemEqualToValue = (a: string, b: string) => a === b;

function valuesEqual(
  a: string | string[] | null | undefined,
  b: string | string[] | null | undefined,
): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return false;
}

export function Root(props: SelectRootProps) {
  const {
    children,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    name,
    disabled = false,
    required = false,
    readOnly = false,
    modal = false,
    id,
    items = {},
    isItemEqualToValue = defaultIsItemEqualToValue,
    multiple = false,
    openOnFocus = false,
  } = props;

  const uid = useId();
  const prefix = id ?? `sel-${uid.replace(/:/g, "")}`;

  const ids = useMemo(
    () => ({
      root: prefix,
      label: `${prefix}-label`,
      trigger: `${prefix}-trigger`,
      content: `${prefix}-content`,
    }),
    [prefix],
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const isControlledValue = value !== undefined;
  const isControlledOpen = open !== undefined;

  const initialValue = isControlledValue
    ? multiple
      ? (value ?? [])
      : (value ?? null)
    : multiple
      ? (defaultValue ?? [])
      : (defaultValue ?? null);

  const storeRef = useRef<SelectStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new SelectStore({
      value: initialValue,
      open: isControlledOpen ? (open ?? false) : (defaultOpen ?? false),
    });
  }
  const store = storeRef.current;

  const prevControlledValue = useRef(value);
  useEffect(() => {
    if (!isControlledValue) return;
    if (valuesEqual(value, prevControlledValue.current)) return;
    prevControlledValue.current = value;

    if (multiple) {
      store.setValues(Array.isArray(value) ? value : []);
    } else {
      store.setValue(typeof value === "string" ? value : null);
    }
  }, [isControlledValue, value, store, multiple]);

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
      if (!valuesEqual(state.value, prevStoreValue.current)) {
        prevStoreValue.current = state.value;
        if (multiple) {
          (onValueChangeRef.current as ((value: string[]) => void) | undefined)?.(
            Array.isArray(state.value) ? state.value : [],
          );
        } else {
          (onValueChangeRef.current as ((value: string | null) => void) | undefined)?.(
            typeof state.value === "string" ? state.value : null,
          );
        }
      }
    });
  }, [store, multiple]);

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
      openSource: state.openSource ?? "trigger",
      trigger: triggerRef.current,
    });
  }, [store]);

  const selectValue = useCallback(
    (itemValue: string) => {
      if (multiple) {
        store.toggleValue(itemValue, isItemEqualToValue);
        return;
      }
      store.setValue(itemValue);
      close();
    },
    [store, close, multiple, isItemEqualToValue],
  );

  const clearValue = useCallback(() => {
    store.clearValue(multiple);
  }, [store, multiple]);

  const scrollToIndex = useCallback(
    (index: number, options?: ScrollToIndexOptions) => {
      scrollToIndexInState(store.getState(), index, options);
    },
    [store],
  );

  const discoveredItems = useMemo(() => extractItemsFromChildren(children), [children]);
  const mergedItems = useMemo(
    () => ({ ...discoveredItems, ...items }),
    [discoveredItems, items],
  );

  const config = useMemo(
    () => ({
      disabled,
      required,
      readOnly,
      modal,
      name,
      multiple,
      items: mergedItems,
      isItemEqualToValue,
      openOnFocus,
    }),
    [disabled, required, readOnly, modal, name, multiple, mergedItems, isItemEqualToValue, openOnFocus],
  );

  const ctx = useMemo(
    () => ({
      store,
      ids,
      refs: { triggerRef, contentRef, listRef },
      config,
      isControlledValue,
      isControlledOpen,
      onOpenChangeComplete,
      close,
      selectValue,
      selectAndClose: selectValue,
      clearValue,
      scrollToIndex,
    }),
    [
      store,
      ids,
      config,
      isControlledValue,
      isControlledOpen,
      onOpenChangeComplete,
      close,
      selectValue,
      clearValue,
      scrollToIndex,
    ],
  );

  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}