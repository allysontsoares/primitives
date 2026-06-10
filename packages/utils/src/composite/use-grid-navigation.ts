import { useCallback, type KeyboardEvent } from "react";

export type GridNavigationKey =
  | "ArrowRight"
  | "ArrowLeft"
  | "ArrowDown"
  | "ArrowUp"
  | "Home"
  | "End";

export interface UseGridNavigationOptions {
  enabled?: boolean;
  columns: number;
  itemCount: number;
  focusedIndex: number;
  onFocusedIndexChange: (index: number) => void;
  isItemDisabled?: (index: number) => boolean;
  direction?: "ltr" | "rtl";
  onSelect?: (index: number) => void;
  onPageUp?: (event: KeyboardEvent) => void;
  onPageDown?: (event: KeyboardEvent) => void;
  /** Return false to leave Escape for parent handlers. */
  onEscape?: () => boolean | void;
  /** Override arrow/home/end movement. Return the next index, or null to skip. */
  getNextIndex?: (current: number, key: GridNavigationKey, event: KeyboardEvent) => number | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function useGridNavigation({
  enabled = true,
  columns,
  itemCount,
  focusedIndex,
  onFocusedIndexChange,
  isItemDisabled,
  direction = "ltr",
  onSelect,
  onPageUp,
  onPageDown,
  onEscape,
  getNextIndex,
}: UseGridNavigationOptions) {
  const moveTo = useCallback(
    (next: number) => {
      if (itemCount <= 0) return;
      onFocusedIndexChange(clamp(next, 0, itemCount - 1));
    },
    [itemCount, onFocusedIndexChange],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || itemCount <= 0) return;

      const rtl = direction === "rtl";
      let next = focusedIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowDown":
        case "ArrowUp":
        case "Home":
        case "End": {
          if (getNextIndex) {
            const custom = getNextIndex(focusedIndex, event.key, event);
            // A number moves to that index; `null` means the callback already
            // handled the movement (e.g. navigated across a page boundary), so
            // we stop without applying the default movement.
            event.preventDefault();
            if (custom !== null && custom !== undefined) {
              moveTo(custom);
            }
            return;
          }
          if (event.key === "ArrowRight") next = focusedIndex + (rtl ? -1 : 1);
          else if (event.key === "ArrowLeft") next = focusedIndex + (rtl ? 1 : -1);
          else if (event.key === "ArrowDown") next = focusedIndex + columns;
          else if (event.key === "ArrowUp") next = focusedIndex - columns;
          else if (event.key === "Home") next = 0;
          else next = itemCount - 1;
          break;
        }
        case "PageUp":
          if (onPageUp) {
            onPageUp(event);
            event.preventDefault();
          }
          return;
        case "PageDown":
          if (onPageDown) {
            onPageDown(event);
            event.preventDefault();
          }
          return;
        case "Escape":
          if (onEscape) {
            const handled = onEscape();
            if (handled !== false) event.preventDefault();
          }
          return;
        case "Enter":
        case " ":
          if (!isItemDisabled?.(focusedIndex)) {
            onSelect?.(focusedIndex);
          }
          event.preventDefault();
          return;
        default:
          return;
      }

      event.preventDefault();
      moveTo(next);
    },
    [
      enabled,
      itemCount,
      focusedIndex,
      columns,
      direction,
      moveTo,
      onPageUp,
      onPageDown,
      onEscape,
      onSelect,
      isItemDisabled,
      getNextIndex,
    ],
  );

  return { onKeyDown };
}
