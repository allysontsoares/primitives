import type { KeyboardEvent } from "react";

const GRID_SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

export function isGridNavigationKey(key: string): boolean {
  return GRID_SCROLL_KEYS.has(key);
}

/** Prevent the browser from scrolling the page when grid navigation keys are pressed. */
export function preventGridScrollOnKeyDown(event: KeyboardEvent): void {
  if (isGridNavigationKey(event.key)) {
    event.preventDefault();
  }
}
