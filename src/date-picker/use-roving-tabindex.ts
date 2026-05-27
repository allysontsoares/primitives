import { useEffect, type RefObject } from 'react';

export function useRovingTabindex(
  containerRef: RefObject<HTMLElement | null>,
  activeSelector: string,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const cells = Array.from(container.querySelectorAll<HTMLElement>('[role="gridcell"]'));

    cells.forEach((cell) => {
      cell.setAttribute('tabindex', '-1');
    });

    const active = container.querySelector<HTMLElement>(activeSelector);
    if (active) active.setAttribute('tabindex', '0');
  });
}
