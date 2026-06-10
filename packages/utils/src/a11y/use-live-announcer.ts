import { useCallback, useEffect, useRef, useState } from "react";

export type LivePoliteness = "polite" | "assertive";

export function useLiveAnnouncer(politeness: LivePoliteness = "polite") {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const announce = useCallback((text: string, clearAfterMs = 0) => {
    setMessage("");
    requestAnimationFrame(() => {
      setMessage(text);
      if (clearAfterMs > 0) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setMessage(""), clearAfterMs);
      }
    });
  }, []);

  const liveRegionProps = {
    role: "status" as const,
    "aria-live": politeness,
    "aria-atomic": true as const,
    children: message,
  };

  return { announce, message, liveRegionProps };
}
