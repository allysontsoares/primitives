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

  // Resolve and bind the Floating UI anchor while the popover is open.
  //
  // The segmented Input remounts its group element (via a `key`) whenever an
  // external date change occurs, which swaps out the DOM node we anchor to.
  // Because that remount is local state inside <Input>, it does NOT re-render
  // <Content>, so a one-shot effect would keep pointing Floating UI at the now
  // detached old node — a detached node measures as (0,0), parking the popover
  // in the top-left corner. We watch the DOM for that swap and re-bind the
  // reference to the current node so positioning always tracks the live anchor.
  useLayoutEffect(() => {
    if (!isOpen) return;

    const resolveAnchor = (): HTMLElement | null => {
      const input =
        document.getElementById(ids.input) ?? document.getElementById(`${ids.input}-0`);
      const trigger = document.getElementById(ids.trigger);

      // When input and trigger share a row wrapper, anchor to the full control
      // so the popover centers under input + trigger (not only the input).
      if (input && trigger) {
        const row = input.parentElement;
        if (row && row === trigger.parentElement) return row;
      }

      return (
        input ??
        document.getElementById(`${ids.input}-1`) ??
        trigger
      );
    };

    let current = resolveAnchor();
    setReference(current);

    const observer = new MutationObserver(() => {
      const next = resolveAnchor();
      if (next && next !== current) {
        current = next;
        setReference(next);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
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

  // Floating UI computes the position one frame after mount, so the element
  // briefly sits at (0,0) before jumping to the anchor. If the consumer applies
  // a CSS transition (e.g. `transition-all`), that jump animates as a visible
  // "fly-in" from the top-left corner. We suppress transitions until the frame
  // after the first successful positioning, then restore them so later moves
  // (scroll, resize, collision flips) still animate smoothly.
  const [transitionsReady, setTransitionsReady] = useState(false);
  useEffect(() => {
    if (!isOpen || !isPositioned) {
      setTransitionsReady(false);
      return;
    }
    const raf = requestAnimationFrame(() => setTransitionsReady(true));
    return () => cancelAnimationFrame(raf);
  }, [isOpen, isPositioned]);

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
        // Hide via opacity (not `visibility`/`display`) while Floating UI
        // resolves the first position: this keeps the popover at (0,0)
        // invisible to sighted users for one frame without removing it from
        // the accessibility tree, so assistive tech still sees the dialog.
        ...(isOpen && !isPositioned ? { opacity: 0, pointerEvents: "none" } : undefined),
        ...(isOpen && !transitionsReady ? { transition: "none" } : undefined),
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
