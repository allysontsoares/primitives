import { useEffect, type RefObject } from "react";
import { getFocusableElements } from "./get-focusable-elements";

/**
 * Opt-in focus trap for `modal={true}` popups only.
 * Does not set aria-modal or document inert — callers own those concerns.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, enabled = true): void {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const focusable = getFocusableElements(container);
      if (!focusable.length) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    const observer = new MutationObserver(() => {
      const active = document.activeElement;
      if (!container.contains(active)) {
        const firstFocusable = getFocusableElements(container)[0];
        firstFocusable?.focus();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
    container.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("keydown", onKeyDown);
      observer.disconnect();
    };
  }, [enabled, containerRef]);
}