import type { Ref, RefCallback, MutableRefObject } from 'react';

let counter = 0;

export function generateId(prefix = 'dp'): string {
  return `${prefix}-${++counter}`;
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    }
  };
}

type EventHandler<E extends Event> = ((e: E) => void) | undefined;

export function composeEventHandlers<E extends Event>(
  ...handlers: Array<EventHandler<E>>
): (e: E) => void {
  return (e: E) => {
    for (const handler of handlers) {
      if (e.defaultPrevented) break;
      handler?.(e);
    }
  };
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.closest('[hidden]') && el.offsetParent !== null
  );
}
