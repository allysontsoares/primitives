import React, {
  useEffect,
  useCallback,
  useLayoutEffect,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  useFloating,
  usePresence,
  useClickOutside,
  useEscapeKey,
  useListNavigation,
  useTypeahead,
  useFocusTrap,
} from "@kenos-ui/utils";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";
import type { SelectContentProps } from "../types";

export function Content({
  children,
  forceMount,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
  portal = false,
  sameWidth = false,
  style,
  onKeyDown,
  ...props
}: SelectContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const { store, ids, refs, config, close, selectAndClose } = useSelectContext();
  const open = useSelectStore(store, (s) => s.open);
  const highlightedValue = useSelectStore(store, (s) => s.highlightedValue);
  const items = useSelectStore(store, (s) => s.items);

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
    setReference(refs.triggerRef.current);
  }, [open, refs.triggerRef, setReference]);

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.contentRef.current = node;
      setFloating(node);
    },
    [refs.contentRef, setFloating],
  );

  const { present } = usePresence({ open, lazyMount: true, unmountOnExit: false });

  useClickOutside([refs.contentRef, refs.triggerRef], close, open);

  useEscapeKey({
    enabled: open,
    stopPropagation: true,
    onEscape: close,
  });

  useFocusTrap(refs.contentRef, open && config.modal);

  const navItems = Array.from(items.values()).map((item) => ({
    value: item.value,
    disabled: item.disabled,
  }));

  const { onKeyDown: onNavKeyDown } = useListNavigation({
    enabled: open && !config.disabled && !config.readOnly,
    items: navItems,
    highlightedValue,
    onHighlight: (v) => store.setHighlightedValue(v),
    loop: true,
  });

  const typeaheadItems = Array.from(items.values()).map((item) => ({
    value: item.value,
    disabled: item.disabled,
    textValue: item.textValue,
  }));

  const { onKeyDown: onTypeaheadKeyDown } = useTypeahead({
    enabled: open && !config.disabled && !config.readOnly,
    items: typeaheadItems,
    onMatch: (v) => store.setHighlightedValue(v),
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        if (highlightedValue != null) {
          e.preventDefault();
          const item = items.get(highlightedValue);
          if (item && !item.disabled) {
            selectAndClose(highlightedValue);
          }
        }
        return;
      }
      onNavKeyDown(e);
      onTypeaheadKeyDown(e);
      onKeyDown?.(e);
    },
    [highlightedValue, items, selectAndClose, onNavKeyDown, onTypeaheadKeyDown, onKeyDown],
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
    if (!open || !refs.contentRef.current) return;
    const state = store.getState();
    if (state.highlightedValue == null) {
      const first = navItems.find((i) => !i.disabled);
      if (first) store.setHighlightedValue(first.value);
    }
    refs.contentRef.current.focus({ preventScroll: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on open
  }, [open]);

  useEffect(() => {
    if (!open || !highlightedValue) return;
    const item = items.get(highlightedValue);
    if (typeof item?.ref?.scrollIntoView === "function") {
      item.ref.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedValue, items, open]);

  if (!present && !forceMount) return null;

  const content = (
    <div
      ref={mergedRef}
      id={ids.content}
      data-state={open ? "open" : "closed"}
      data-open={open ? "true" : undefined}
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
  );

  return portal ? createPortal(content, document.body) : content;
}