import { useEffect, useRef, type RefObject } from "react";

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
): void {
  // Keep a stable ref to the latest refs array so the effect doesn't need to
  // spread it into deps (oxlint flags spreads as complex expressions).
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!enabled) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (refsRef.current.every((r) => !r.current?.contains(target))) {
        handler();
      }
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [enabled, handler]);
}
