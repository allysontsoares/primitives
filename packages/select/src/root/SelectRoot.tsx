import React, { useId, useMemo, useRef, useEffect, useCallback } from "react";
import { restoreFocus } from "@kenos-ui/utils";
import { SelectStore } from "../store";
import { SelectContext } from "../context";
import type { SelectRootProps } from "../types";

export function Root({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  name,
  disabled = false,
  required = false,
  readOnly = false,
  modal = false,
  id,
}: SelectRootProps) {
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

  const storeRef = useRef<SelectStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new SelectStore({
      value: isControlledValue ? (value ?? null) : (defaultValue ?? null),
      open: isControlledOpen ? (open ?? false) : (defaultOpen ?? false),
    });
  }
  const store = storeRef.current;

  const prevControlledValue = useRef(value);
  useEffect(() => {
    if (!isControlledValue) return;
    if (value === prevControlledValue.current) return;
    prevControlledValue.current = value;
    store.setValue(value ?? null);
  }, [isControlledValue, value, store]);

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
        onValueChangeRef.current?.(state.value);
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
      openSource: state.openSource ?? "trigger",
      trigger: triggerRef.current,
    });
  }, [store]);

  const selectAndClose = useCallback(
    (itemValue: string) => {
      store.setValue(itemValue);
      close();
    },
    [store, close],
  );

  const config = useMemo(
    () => ({ disabled, required, readOnly, modal, name }),
    [disabled, required, readOnly, modal, name],
  );

  const ctx = useMemo(
    () => ({
      store,
      ids,
      refs: { triggerRef, contentRef, listRef },
      config,
      isControlledValue,
      isControlledOpen,
      close,
      selectAndClose,
    }),
    [store, ids, config, isControlledValue, isControlledOpen, close, selectAndClose],
  );

  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}