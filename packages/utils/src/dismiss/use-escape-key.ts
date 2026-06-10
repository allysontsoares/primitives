import { useEffect, useRef, type RefObject } from "react";

export interface UseEscapeKeyOptions {
  enabled: boolean;
  onEscape: () => void;
  stopPropagation?: boolean | undefined;
  /** When set, only fires if activeElement is inside this element. */
  scopeRef?: RefObject<HTMLElement | null> | undefined;
}

export function useEscapeKey({
  enabled,
  onEscape,
  stopPropagation = true,
  scopeRef,
}: UseEscapeKeyOptions): void {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  const scopeRefRef = useRef(scopeRef);
  scopeRefRef.current = scopeRef;

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;

      const scope = scopeRefRef.current?.current;
      if (scope) {
        const active = document.activeElement;
        if (!active || !scope.contains(active)) return;
      }

      if (stopPropagation) {
        e.stopPropagation();
      }

      onEscapeRef.current();
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [enabled, stopPropagation]);
}
