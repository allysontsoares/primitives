import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useDatePickerContext } from "./context";
import { useClickOutside } from "./use-click-outside";
import { useFocusTrap } from "./use-focus-trap";
import { formatMonthYear, formatYear } from "../utils/locale";
import { useDatePickerFloating } from "./use-floating";

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number;
  portal?: boolean;
}

export function Content({
  children,
  forceMount,
  side,
  align,
  sideOffset,
  alignOffset,
  avoidCollisions,
  collisionPadding,
  portal = false,
  style,
  onKeyDown,
  ...props
}: ContentProps) {
  const { state, dispatch, ids, config } = useDatePickerContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const isOpen = state.open;
  const shouldRender = forceMount || isOpen;

  // Kept as refs (not state) so click-outside detection stays stable across renders.
  const triggerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLElement | null>(null);
  const input0Ref = useRef<HTMLElement | null>(null);
  const input1Ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    triggerRef.current = document.getElementById(ids.trigger);
    inputRef.current = document.getElementById(ids.input);
    input0Ref.current = document.getElementById(`${ids.input}-0`);
    input1Ref.current = document.getElementById(`${ids.input}-1`);
  });

  const { setReference, setFloating, floatingStyles, isPositioned } = useDatePickerFloating({
    open: isOpen,
    ...(side !== undefined && { side }),
    ...(align !== undefined && { align }),
    ...(sideOffset !== undefined && { sideOffset }),
    ...(alignOffset !== undefined && { alignOffset }),
    ...(avoidCollisions !== undefined && { avoidCollisions }),
    ...(collisionPadding !== undefined && { collisionPadding }),
  });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = document.getElementById(ids.input) ||
               document.getElementById(`${ids.input}-0`) ||
               document.getElementById(ids.trigger);
    setReference(el);
  }, [isOpen, ids.input, ids.trigger, setReference]);

  // Memoized so the ref callback identity is stable across re-renders.
  // Without this, React would call it with null then element on every render,
  // causing setFloating null/element cycles that interfere with state updates.
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      setFloating(node);
    },
    [setFloating],
  );

  useClickOutside(
    [contentRef, triggerRef, inputRef, input0Ref, input1Ref],
    () => dispatch({ type: "CLOSE" }),
    isOpen,
  );
  useFocusTrap(contentRef, isOpen);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    if (state.openSource === "input") return;
    const active = document.activeElement;
    const activeRole = active?.getAttribute("role");
    if (activeRole === "combobox" || activeRole === "spinbutton") return;
    const firstFocusable = contentRef.current.querySelector<HTMLElement>(
      'button:not([disabled]), [tabindex="0"]',
    );
    firstFocusable?.focus();
  }, [isOpen, state.openSource]);

  const announcement =
    state.view === "day"
      ? formatMonthYear(new Date(state.focusedYear, state.focusedMonth, 1), config.locale)
      : state.view === "month"
        ? formatYear(state.focusedYear, config.locale)
        : `${state.yearPageStart}–${state.yearPageStart + 11}`;

  if (!shouldRender) return null;

  const content = (
    <div
      ref={mergedRef}
      id={ids.content}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ids.label}
      data-state={isOpen ? "open" : "closed"}
      style={{
        ...floatingStyles,
        ...(!isOpen ? { display: "none" } : undefined),
        visibility: isOpen && !isPositioned ? "hidden" : undefined,
        ...style,
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          dispatch({ type: "CLOSE" });
          document.getElementById(ids.trigger)?.focus();
        }
        onKeyDown?.(e);
      }}
      {...props}
    >
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
      >
        {isOpen ? announcement : ""}
      </span>
      {children}
    </div>
  );

  return portal ? createPortal(content, document.body) : content;
}
