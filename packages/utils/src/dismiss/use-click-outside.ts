import { useEffect, useRef, type RefObject } from "react";

export interface UseClickOutsideOptions {
  onInteractOutside?: () => void;
  onInteractOutsideStart?: (event: PointerEvent) => void;
}

function isOutside(refs: RefObject<HTMLElement | null>[], event: PointerEvent): boolean {
  const path = event.composedPath();
  return refs.every((r) => {
    const el = r.current;
    if (!el) return true;
    return !path.includes(el);
  });
}

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
  options?: UseClickOutsideOptions,
): void {
  const refsRef = useRef(refs);
  refsRef.current = refs;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!enabled) return;

    let pointerDownOutside = false;

    function onPointerDown(e: PointerEvent) {
      if (e.button > 0) return;

      if (isOutside(refsRef.current, e)) {
        optionsRef.current?.onInteractOutsideStart?.(e);
        pointerDownOutside = true;
      } else {
        pointerDownOutside = false;
      }
    }

    function onClick(e: MouseEvent) {
      if (!pointerDownOutside) return;
      if (e.button > 0) return;

      if (isOutside(refsRef.current, e as unknown as PointerEvent)) {
        optionsRef.current?.onInteractOutside?.();
        handlerRef.current();
      }
      pointerDownOutside = false;
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [enabled]);
}
