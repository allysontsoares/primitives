export function focusWithoutScrolling(element: HTMLElement): void {
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

export function captureActiveElement(): Element | null {
  return document.activeElement;
}
