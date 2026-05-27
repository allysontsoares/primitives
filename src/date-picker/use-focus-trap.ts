import { useEffect, type RefObject } from 'react';
import { getFocusableElements } from '../utils/aria';

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Re-query focusable elements each keydown so view switches (day→month→year)
    // that change the DOM don't result in stale element lists.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements(container);
      if (!focusable.length) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // When the DOM inside the dialog changes (e.g. view switch mounts new buttons),
    // ensure focus hasn't escaped to the body.
    const observer = new MutationObserver(() => {
      const active = document.activeElement;
      // Don't recapture focus if the input segments (spinbuttons) are intentionally focused
      if (active?.getAttribute('role') === 'spinbutton') return;
      if (!container.contains(active)) {
        const firstFocusable = getFocusableElements(container)[0];
        firstFocusable?.focus();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
    };
  }, [enabled, containerRef]);
}
