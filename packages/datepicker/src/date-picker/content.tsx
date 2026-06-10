import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import {
  useClickOutside,
  useEscapeKey,
  useFocusTrap,
  useFloating,
  restoreFocus,
  captureActiveElement,
} from "@kenos-ui/utils";
import { useDatePickerContext } from "./context";
import { useDatePickerAnnouncer } from "./use-date-picker-announcer";

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

  const previousActiveElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = captureActiveElement();
    }
  }, [isOpen]);

  const { setReference, setFloating, floatingStyles, isPositioned } = useFloating({
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
      const input = document.getElementById(ids.input) ?? document.getElementById(`${ids.input}-0`);
      const trigger = document.getElementById(ids.trigger);

      // When input and trigger share a row wrapper, anchor to the full control
      // so the popover centers under input + trigger (not only the input).
      if (input && trigger) {
        const row = input.parentElement;
        if (row && row === trigger.parentElement) return row;
      }

      return input ?? document.getElementById(`${ids.input}-1`) ?? trigger;
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

  const close = useCallback(() => {
    const source = state.openSource;
    dispatch({ type: "CLOSE" });
    restoreFocus({
      openSource: source === "input" ? "input" : source === "trigger" ? "trigger" : "unknown",
      trigger: document.getElementById(ids.trigger),
      input: document.getElementById(ids.input) ?? document.getElementById(`${ids.input}-0`),
      previousActiveElement: previousActiveElementRef.current,
    });
  }, [dispatch, ids.input, ids.trigger, state.openSource]);

  useClickOutside([contentRef, triggerRef, inputRef, input0Ref, input1Ref], close, isOpen);

  useEscapeKey({
    enabled: isOpen,
    stopPropagation: true,
    scopeRef: contentRef,
    onEscape: () => {
      if (config.mode === "range" && state.rangeStart && !state.rangeEnd) {
        dispatch({ type: "CANCEL_RANGE_ANCHOR" });
        return;
      }
      close();
    },
  });

  useFocusTrap(contentRef, isOpen && config.modal);

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

  // Portal targets document.body, which is unavailable during SSR. Rendering inline on
  // the server and portaling on the client causes hydration mismatches in popover content.
  const [portalReady, setPortalReady] = useState(!portal);
  useEffect(() => {
    if (portal) setPortalReady(true);
  }, [portal]);

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

  const liveRegionProps = useDatePickerAnnouncer(state, config, isOpen);

  if (!shouldRender || (portal && !portalReady)) return null;

  const content = (
    <div
      ref={mergedRef}
      id={ids.content}
      role="dialog"
      aria-modal={config.modal ? "true" : undefined}
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
      onKeyDown={onKeyDown}
      {...props}
    >
      <span
        {...liveRegionProps}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
      />
      {children}
    </div>
  );

  if (portal) {
    return createPortal(content, document.body);
  }
  return content;
}
