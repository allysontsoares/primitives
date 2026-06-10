import { getFocusableElements } from "./get-focusable-elements";
import { focusWithoutScrolling } from "./focus-without-scrolling";

function focusElement(el: HTMLElement | null | undefined): HTMLElement | null {
  if (!el) return null;
  focusWithoutScrolling(el);
  return el;
}

export interface FocusManagerOptions {
  tabbable?: boolean;
  wrap?: boolean;
  accept?: (element: HTMLElement) => boolean;
  includeHidden?: boolean;
}

export interface FocusManager {
  focusNext: (from?: HTMLElement | null) => HTMLElement | null;
  focusPrevious: (from?: HTMLElement | null) => HTMLElement | null;
  focusFirst: () => HTMLElement | null;
  focusLast: () => HTMLElement | null;
}

function filterFocusable(container: HTMLElement, options: FocusManagerOptions): HTMLElement[] {
  const focusOpts =
    options.includeHidden !== undefined ? { includeHidden: options.includeHidden } : {};
  const elements = getFocusableElements(container, focusOpts);
  if (!options.accept) return elements;
  return elements.filter(options.accept);
}

export function createFocusManager(
  getContainer: () => HTMLElement | null,
  defaultOptions: FocusManagerOptions = {},
): FocusManager {
  function getElements(): HTMLElement[] {
    const container = getContainer();
    if (!container) return [];
    return filterFocusable(container, defaultOptions);
  }

  return {
    focusNext(from) {
      const elements = getElements();
      if (!elements.length) return null;

      const active = from ?? (document.activeElement as HTMLElement | null);
      const index = active ? elements.indexOf(active) : -1;

      if (index >= 0 && index < elements.length - 1) {
        return focusElement(elements[index + 1]);
      }

      if (defaultOptions.wrap && index === elements.length - 1) {
        return focusElement(elements[0]);
      }

      if (index === -1) {
        return focusElement(elements[0]);
      }

      return null;
    },

    focusPrevious(from) {
      const elements = getElements();
      if (!elements.length) return null;

      const active = from ?? (document.activeElement as HTMLElement | null);
      const index = active ? elements.indexOf(active) : -1;

      if (index > 0) {
        return focusElement(elements[index - 1]);
      }

      if (defaultOptions.wrap && index === 0) {
        return focusElement(elements[elements.length - 1]);
      }

      if (index === -1) {
        return focusElement(elements[elements.length - 1]);
      }

      return null;
    },

    focusFirst() {
      const elements = getElements();
      return focusElement(elements[0]);
    },

    focusLast() {
      const elements = getElements();
      return focusElement(elements[elements.length - 1]);
    },
  };
}
