import { useEffect, useRef } from "react";

export interface UseEscapeKeyOptions {
  enabled: boolean;
  onEscape: () => void;
  stopPropagation?: boolean | undefined;
}

export function useEscapeKey({
  enabled,
  onEscape,
  stopPropagation = true,
}: UseEscapeKeyOptions): void {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;

      if (stopPropagation) {
        e.stopPropagation();
      }

      onEscapeRef.current();
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [enabled, stopPropagation]);
}