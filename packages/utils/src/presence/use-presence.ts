import { useEffect, useRef, useState } from "react";

export interface UsePresenceOptions {
  open: boolean;
  lazyMount?: boolean | undefined;
  unmountOnExit?: boolean | undefined;
  onOpenChangeComplete?: ((open: boolean) => void) | undefined;
}

export interface UsePresenceReturn {
  /** Whether the content should be in the DOM (render children). */
  present: boolean;
  /** Current open state (pass-through for convenience). */
  open: boolean;
}

export function usePresence({
  open,
  lazyMount = true,
  unmountOnExit = false,
  onOpenChangeComplete,
}: UsePresenceOptions): UsePresenceReturn {
  const [hasBeenOpen, setHasBeenOpen] = useState(!lazyMount);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (open) {
      setHasBeenOpen(true);
    }
  }, [open]);

  const present = lazyMount
    ? open || (hasBeenOpen && !unmountOnExit)
    : open || !unmountOnExit;

  useEffect(() => {
    if (prevOpenRef.current === open) return;

    if (!open && unmountOnExit) {
      setHasBeenOpen(false);
    }

    onOpenChangeComplete?.(open);
    prevOpenRef.current = open;
  }, [open, unmountOnExit, onOpenChangeComplete]);

  return { present, open };
}