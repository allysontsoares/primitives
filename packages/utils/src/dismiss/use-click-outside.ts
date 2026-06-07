import { useEffect, useRef, type RefObject } from "react";

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
): void {
  const refsRef = useRef(refs);
  refsRef.current = refs;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (refsRef.current.every((r) => !r.current?.contains(target))) {
        handlerRef.current();
      }
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [enabled]);
}