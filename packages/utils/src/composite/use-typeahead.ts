import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";

export interface TypeaheadItem {
  value: string;
  disabled: boolean;
  textValue: string;
}

export interface UseTypeaheadOptions {
  enabled: boolean;
  items: TypeaheadItem[];
  onMatch: (value: string) => void;
  resetDelay?: number | undefined;
}

function isPrintableKey(event: KeyboardEvent): boolean {
  if (event.key.length !== 1) return false;
  if (event.ctrlKey || event.metaKey || event.altKey) return false;
  return /^[\p{L}\p{N}\s]$/u.test(event.key);
}

export function useTypeahead({
  enabled,
  items,
  onMatch,
  resetDelay = 500,
}: UseTypeaheadOptions) {
  const queryRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const resetQuery = useCallback(() => {
    queryRef.current = "";
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !isPrintableKey(event)) return;

      event.preventDefault();
      queryRef.current += event.key.toLowerCase();

      const match = items.find(
        (item) =>
          !item.disabled && item.textValue.toLowerCase().startsWith(queryRef.current),
      );

      if (match) {
        onMatch(match.value);
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(resetQuery, resetDelay);
    },
    [enabled, items, onMatch, resetDelay, resetQuery],
  );

  return { onKeyDown, resetQuery };
}