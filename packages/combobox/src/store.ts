import { useSyncExternalStore, useCallback, useRef } from "react";
import type { ComboboxItemEqualFn, ComboboxStoreState, ComboboxItemRecord } from "./types";

// ── ComboboxStore ────────────────────────────────────────────────────────────

type Listener = () => void;

export class ComboboxStore {
  private state: ComboboxStoreState;
  private listeners = new Set<Listener>();

  constructor(initial: Partial<ComboboxStoreState> = {}) {
    this.state = {
      open: false,
      openSource: null,
      value: null,
      inputValue: "",
      highlightedValue: null,
      items: new Map(),
      ...initial,
    };
  }

  getState(): ComboboxStoreState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // ── Mutations ────────────────────────────────────────────────────────────

  setOpen(open: boolean, source: "input" | "trigger" | null = null): void {
    if (this.state.open === open) return;
    this.state = {
      ...this.state,
      open,
      openSource: open ? source : null,
      highlightedValue: open ? this.state.highlightedValue : null,
    };
    this.notify();
  }

  setValue(value: string | null): void {
    if (this.state.value === value) return;
    this.state = { ...this.state, value };
    this.notify();
  }

  setInputValue(inputValue: string): void {
    if (this.state.inputValue === inputValue) return;
    this.state = { ...this.state, inputValue };
    this.notify();
  }

  clearValue(): void {
    if (this.state.value === null && this.state.inputValue === "") return;
    this.state = { ...this.state, value: null, inputValue: "" };
    this.notify();
  }

  isSelected(value: string, comparator: ComboboxItemEqualFn): boolean {
    const current = this.state.value;
    return typeof current === "string" && comparator(current, value);
  }

  setHighlightedValue(value: string | null): void {
    if (this.state.highlightedValue === value) return;
    this.state = { ...this.state, highlightedValue: value };
    this.notify();
  }

  registerItem(record: ComboboxItemRecord): void {
    const next = new Map(this.state.items);
    next.set(record.value, record);
    this.state = { ...this.state, items: next };
    this.notify();
  }

  unregisterItem(value: string): void {
    if (!this.state.items.has(value)) return;
    const next = new Map(this.state.items);
    next.delete(value);
    this.state = { ...this.state, items: next };
    this.notify();
  }

  updateItemRef(value: string, ref: HTMLElement | null): void {
    const item = this.state.items.get(value);
    if (!item || item.ref === ref) return;
    const next = new Map(this.state.items);
    next.set(value, { ...item, ref });
    this.state = { ...this.state, items: next };
    // Don't notify for ref updates — avoids render cascades
  }
}

// ── useComboboxStore ─────────────────────────────────────────────────────────

/**
 * Subscribe to a slice of the ComboboxStore.
 * Re-renders only when the selected slice changes (by reference).
 */
export function useComboboxStore<T>(
  store: ComboboxStore,
  selector: (s: ComboboxStoreState) => T,
): T {
  return useSyncExternalStore(
    useCallback((cb) => store.subscribe(cb), [store]),
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}

// ── useComboboxStateRef ──────────────────────────────────────────────────────

/**
 * Return a stable ref to the store's current state getter.
 * Useful for event handlers that need a snapshot without subscribing.
 */
export function useComboboxStateRef(
  store: ComboboxStore,
): React.RefObject<ComboboxStoreState> {
  const ref = useRef(store.getState());
  ref.current = store.getState();
  return ref;
}