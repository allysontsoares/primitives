export type OpenSource = "trigger" | "input" | "unknown";

export interface RestoreFocusOptions {
  openSource?: OpenSource | undefined;
  trigger?: HTMLElement | null | undefined;
  input?: HTMLElement | null | undefined;
  previousActiveElement?: Element | null | undefined;
}

function isFocusable(element: Element | null | undefined): element is HTMLElement {
  return element instanceof HTMLElement && element.isConnected;
}

export function restoreFocus({
  openSource = "unknown",
  trigger,
  input,
  previousActiveElement,
}: RestoreFocusOptions): void {
  let target: HTMLElement | null = null;

  switch (openSource) {
    case "trigger":
      target = trigger ?? null;
      break;
    case "input":
      target = input ?? null;
      break;
    case "unknown":
      target = isFocusable(previousActiveElement)
        ? previousActiveElement
        : (trigger ?? null);
      break;
  }

  if (isFocusable(target)) {
    target.focus();
  }
}