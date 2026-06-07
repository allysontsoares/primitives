import { useCallback } from "react";
import type { KeyboardEvent } from "react";

export interface ListNavigationItem {
  value: string;
  disabled: boolean;
}

export interface UseListNavigationOptions {
  enabled: boolean;
  items: ListNavigationItem[];
  highlightedValue: string | null;
  onHighlight: (value: string | null) => void;
  loop?: boolean | undefined;
}

function getEnabledItems(items: ListNavigationItem[]): ListNavigationItem[] {
  return items.filter((item) => !item.disabled);
}

function getNextIndex(
  currentIndex: number,
  direction: 1 | -1,
  length: number,
  loop: boolean,
): number {
  const next = currentIndex + direction;
  if (next < 0) return loop ? length - 1 : 0;
  if (next >= length) return loop ? 0 : length - 1;
  return next;
}

export function useListNavigation({
  enabled,
  items,
  highlightedValue,
  onHighlight,
  loop = true,
}: UseListNavigationOptions) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const enabledItems = getEnabledItems(items);
      if (!enabledItems.length) return;

      const currentIndex = enabledItems.findIndex((item) => item.value === highlightedValue);

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const index =
            currentIndex === -1
              ? 0
              : getNextIndex(currentIndex, 1, enabledItems.length, loop);
          onHighlight(enabledItems[index]?.value ?? null);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const index =
            currentIndex === -1
              ? enabledItems.length - 1
              : getNextIndex(currentIndex, -1, enabledItems.length, loop);
          onHighlight(enabledItems[index]?.value ?? null);
          break;
        }
        case "Home": {
          event.preventDefault();
          onHighlight(enabledItems[0]?.value ?? null);
          break;
        }
        case "End": {
          event.preventDefault();
          onHighlight(enabledItems[enabledItems.length - 1]?.value ?? null);
          break;
        }
        default:
          break;
      }
    },
    [enabled, highlightedValue, items, loop, onHighlight],
  );

  return { onKeyDown };
}