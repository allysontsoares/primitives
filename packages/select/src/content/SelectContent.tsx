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
import { usePositionerContext } from "../positioner/PositionerContext";
import { resolvePortalContainer, usePortalContext } from "../portal/SelectPortal";
import type { SelectContentProps } from "../types";
import { useAlignItemWithTrigger } from "../utils/use-align-item-with-trigger";

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
  container = null,
  sameWidth = false,
  alignItemWithTrigger = false,
  lazyMount = true,
  unmountOnExit = false,
  onOpenChangeComplete: onOpenChangeCompleteProp,
  style,
  onKeyDown,
  ...props
}: SelectContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const {
    store,
    ids,
    refs,
    config,
    close,
    selectValue,
    onOpenChangeComplete: onOpenChangeCompleteRoot,
  } = useSelectContext();
  const open = useSelectStore(store, (s) => s.open);
  const highlightedValue = useSelectStore(store, (s) => s.highlightedValue);
  const items = useSelectStore(store, (s) => s.items);
  const positionerContext = usePositionerContext();
  const isInsidePortal = usePortalContext();

  const onOpenChangeComplete = onOpenChangeCompleteProp ?? onOpenChangeCompleteRoot;

  const ownAlign = useAlignItemWithTrigger({
    alignItemWithTrigger: positionerContext ? false : alignItemWithTrigger,
    side,
    sideOffset,
    open,
    refs,
  });

  const ownFloating = useFloating({
    open: positionerContext ? false : open,
    side,
    align,
    sideOffset: ownAlign.effectiveSideOffset,
    alignOffset,
    avoidCollisions: ownAlign.avoidCollisionsOverride ?? avoidCollisions,
    collisionPadding,
    sameWidth,
  });

  const { setReference } = ownFloating;
  const setFloating = positionerContext?.setFloating ?? ownFloating.setFloating;
  const floatingStyles = positionerContext?.floatingStyles ?? ownFloating.floatingStyles;
  const isPositioned = positionerContext?.isPositioned ?? ownFloating.isPositioned;
  const alignItemWithTriggerActive =
    positionerContext?.alignItemWithTriggerActive ?? ownAlign.alignItemWithTriggerActive;

  useLayoutEffect(() => {
    if (positionerContext || !open) return;
    setReference(refs.triggerRef.current);
  }, [open, positionerContext, refs.triggerRef, setReference]);

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
            selectValue(highlightedValue);
          }
        }
        return;
      }
      onNavKeyDown(e);
      onTypeaheadKeyDown(e);
      onKeyDown?.(e);
    },
    [highlightedValue, items, selectValue, onNavKeyDown, onTypeaheadKeyDown, onKeyDown],
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
      data-align-trigger={alignItemWithTriggerActive ? "true" : undefined}
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

  if (isInsidePortal || !portal) {
    return content;
  }

  const mountNode = resolvePortalContainer(container);
  if (!mountNode) {
    return content;
  }

  return createPortal(content, mountNode);
}