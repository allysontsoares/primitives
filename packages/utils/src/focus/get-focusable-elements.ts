export interface GetFocusableElementsOptions {
  /** Include elements not visible in layout (e.g. popover at opacity:0 during positioning). */
  includeHidden?: boolean;
}

export function getFocusableElements(
  container: HTMLElement,
  options: GetFocusableElementsOptions = {},
): HTMLElement[] {
  const { includeHidden = false } = options;

  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[role="spinbutton"]:not([aria-disabled="true"])',
    '[contenteditable="true"]',
    '[role="gridcell"][tabindex="0"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    if (el.closest("[hidden]")) return false;
    if (includeHidden) return true;

    const style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}
