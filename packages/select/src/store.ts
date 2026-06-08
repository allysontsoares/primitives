import { useSyncExternalStore, useCallback, useRef } from "react";
import type { SelectItemEqualFn, SelectStoreState, SelectItemRecord } from "./types";

// ── SelectStore ────────────────────────────────────────────────────────────

type Listener = () => void;

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export class SelectStore {
  private state: SelectStoreState;
  private listeners = new Set<Listener>();

  constructor(initial: Partial<SelectStoreState> = {}) {
    this.state = {
      open: false,
      openSource: null,
      value: null,
      highlightedValue: null,
      items: new Map(),
      ...initial,
    };
  }

  getState(): SelectStoreState {
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

  setOpen(open: boolean, source: "trigger" | null = null): void {
    if (this.state.open === open) return;
    this.state = {
      ...this.state,
      open,
      openSource: open ? source : null,
      // Reset highlight when closing
      highlightedValue: open ? this.state.highlightedValue : null,
    };
    this.notify();
  }

  setValue(value: string | null): void {
    if (this.state.value === value) return;
    this.state = { ...this.state, value };
    this.notify();
  }

  setValues(values: string[]): void {
    const current = this.state.value;
    if (Array.isArray(current) && arraysEqual(current, values)) return;
    this.state = { ...this.state, value: values };
    this.notify();
  }

  toggleValue(value: string, comparator: SelectItemEqualFn): void {
    const current = this.state.value;
    const next = Array.isArray(current) ? [...current] : [];
    const index = next.findIndex((item) => comparator(item, value));

    if (index >= 0) {
      next.splice(index, 1);
    } else {
      next.push(value);
    }

    if (Array.isArray(current) && arraysEqual(current, next)) return;

    this.state = { ...this.state, value: next };
    this.notify();
  }

  clearValue(multiple: boolean): void {
    const next = multiple ? [] : null;
    const current = this.state.value;

    if (multiple) {
      if (Array.isArray(current) && current.length === 0) return;
    } else if (current === null) {
      return;
    }

    this.state = { ...this.state, value: next };
    this.notify();
  }

  isSelected(value: string, multiple: boolean, comparator: SelectItemEqualFn): boolean {
    const current = this.state.value;

    if (multiple) {
      return Array.isArray(current) && current.some((item) => comparator(item, value));
    }

    return typeof current === "string" && comparator(current, value);
  }

  setHighlightedValue(value: string | null): void {
    if (this.state.highlightedValue === value) return;
    this.state = { ...this.state, highlightedValue: value };
    this.notify();
  }

  registerItem(record: SelectItemRecord): void {
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

// ── useSelectStore ─────────────────────────────────────────────────────────

/**
 * Subscribe to a slice of the SelectStore.
 * Re-renders only when the selected slice changes (by reference).
 */
export function useSelectStore<T>(store: SelectStore, selector: (s: SelectStoreState) => T): T {
  return useSyncExternalStore(
    useCallback((cb) => store.subscribe(cb), [store]),
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}

// ── useSelectStoreRef ──────────────────────────────────────────────────────

/**
 * Return a stable ref to the store's current state getter.
 * Useful for event handlers that need a snapshot without subscribing.
 */
export function useSelectStateRef(store: SelectStore): React.RefObject<SelectStoreState> {
  const ref = useRef(store.getState());
  // Keep in sync each render (no subscription overhead).
  ref.current = store.getState();
  return ref;
}