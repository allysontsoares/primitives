import React, {
  useEffect,
  useCallback,
  useLayoutEffect,
  useState,
  useMemo,
  type KeyboardEvent,
} from "react";
import {
  useFloating,
  usePresence,
  useClickOutside,
  useEscapeKey,
  useListNavigation,
  useSelectCollection,
  useFocusTrap,
} from "@kenos-ui/utils";
import { useComboboxContext } from "../context";
import { useComboboxStore } from "../store";
import { ComboboxCollectionContext } from "../collection-context";
import type { ComboboxContentProps } from "../types";

export function Content({
  children,
  forceMount,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
  sameWidth = false,
  lazyMount = true,
  unmountOnExit = false,
  onOpenChangeComplete: onOpenChangeCompleteProp,
  style,
  onKeyDown,
  ...props
}: ComboboxContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const {
    store,
    ids,
    refs,
    config,
    close,
    selectValue,
    onOpenChangeComplete: onOpenChangeCompleteRoot,
  } = useComboboxContext();
  const open = useComboboxStore(store, (s) => s.open);
  const highlightedValue = useComboboxStore(store, (s) => s.highlightedValue);
  const allItems = useComboboxStore(store, (s) => s.items);
  const inputValue = useComboboxStore(store, (s) => s.inputValue);

  const onOpenChangeComplete = onOpenChangeCompleteProp ?? onOpenChangeCompleteRoot;

  const collection = useSelectCollection({
    items: allItems,
    inputValue,
    filter: config.filter,
  });

  const collectionValue = useMemo(
    () => ({
      filteredItems: collection.items,
      enabledItems: collection.enabledItems,
      isEmpty: collection.isEmpty,
    }),
    [collection.items, collection.enabledItems, collection.isEmpty],
  );

  const navItems = collection.enabledItems.map((item) => ({
    value: item.value,
    disabled: item.disabled,
  }));

  const { setReference, setFloating, floatingStyles, isPositioned } = useFloating({
    open,
    side,
    align,
    sideOffset,
    alignOffset,
    avoidCollisions,
    collisionPadding,
    sameWidth,
  });

  useLayoutEffect(() => {
    if (!open) return;
    setReference(refs.inputRef.current);
  }, [open, refs.inputRef, setReference]);

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.contentRef.current = node;
      setFloating(node);
    },
    [refs.contentRef, setFloating],
  );

  const { present } = usePresence({
    open,
    lazyMount,
    unmountOnExit,
    onOpenChangeComplete,
  });

  useClickOutside([refs.contentRef, refs.inputRef, refs.triggerRef], close, open);

  useEscapeKey({
    enabled: open,
    stopPropagation: true,
    onEscape: close,
  });

  useFocusTrap(refs.contentRef, open && config.modal);

  const { onKeyDown: onNavKeyDown } = useListNavigation({
    enabled: open && !config.disabled && !config.readOnly,
    items: navItems,
    highlightedValue,
    onHighlight: (v) => store.setHighlightedValue(v),
    loop: true,
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        if (highlightedValue != null) {
          e.preventDefault();
          const item = allItems.get(highlightedValue);
          if (item && !item.disabled) {
            selectValue(highlightedValue);
          }
        }
        return;
      }
      onNavKeyDown(e);
      onKeyDown?.(e);
    },
    [highlightedValue, allItems, selectValue, onNavKeyDown, onKeyDown],
  );

  const [transitionsReady, setTransitionsReady] = useState(false);
  useEffect(() => {
    if (!open || !isPositioned) {
      setTransitionsReady(false);
      return;
    }
    const raf = requestAnimationFrame(() => setTransitionsReady(true));
    return () => cancelAnimationFrame(raf);
  }, [open, isPositioned]);

  useEffect(() => {
    if (!open) return;
    const state = store.getState();
    if (state.highlightedValue == null) {
      const first = navItems.find((i) => !i.disabled);
      if (first) store.setHighlightedValue(first.value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on open/filter change
  }, [open, inputValue, navItems.length]);

  useEffect(() => {
    if (!open || !highlightedValue) return;
    const item = allItems.get(highlightedValue);
    if (typeof item?.ref?.scrollIntoView === "function") {
      item.ref.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedValue, allItems, open]);

  if (!present && !forceMount) return null;

  return (
    <ComboboxCollectionContext.Provider value={collectionValue}>
      <div
        ref={mergedRef}
        id={ids.content}
        data-state={open ? "open" : "closed"}
        data-open={open ? "true" : undefined}
        data-empty={collection.isEmpty ? "true" : undefined}
        aria-modal={config.modal ? "true" : undefined}
        tabIndex={-1}
        style={{
          ...floatingStyles,
          ...(!open ? { display: "none" } : undefined),
          ...(open && !isPositioned ? { opacity: 0, pointerEvents: "none" } : undefined),
          ...(open && !transitionsReady ? { transition: "none" } : undefined),
          ...style,
        }}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </ComboboxCollectionContext.Provider>
  );
}