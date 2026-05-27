import { useEffect, type RefObject } from 'react';

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (refs.every((r) => !r.current?.contains(target))) {
        handler();
      }
    }

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [enabled, handler, ...refs]);
}
