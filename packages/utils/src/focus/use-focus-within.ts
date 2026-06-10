import { useCallback, useRef, type FocusEvent, type RefObject } from "react";

export interface UseFocusWithinOptions {
  isDisabled?: boolean;
  excludeRefs?: RefObject<HTMLElement | null>[];
  onFocusWithin?: (event: FocusEvent) => void;
  onBlurWithin?: (event: FocusEvent) => void;
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

function isExcluded(
  relatedTarget: EventTarget | null,
  excludeRefs?: RefObject<HTMLElement | null>[],
): boolean {
  if (!relatedTarget || !excludeRefs?.length) return false;
  return excludeRefs.some((ref) => ref.current?.contains(relatedTarget as Node));
}

export function useFocusWithin({
  isDisabled = false,
  excludeRefs,
  onFocusWithin,
  onBlurWithin,
  onFocusWithinChange,
}: UseFocusWithinOptions) {
  const isFocusWithinRef = useRef(false);
  const excludeRefsRef = useRef(excludeRefs);
  excludeRefsRef.current = excludeRefs;

  const onFocus = useCallback(
    (event: FocusEvent) => {
      if (isDisabled) return;
      if (!isFocusWithinRef.current) {
        isFocusWithinRef.current = true;
        onFocusWithin?.(event);
        onFocusWithinChange?.(true);
      }
    },
    [isDisabled, onFocusWithin, onFocusWithinChange],
  );

  const onBlur = useCallback(
    (event: FocusEvent) => {
      if (isDisabled) return;
      const related = event.relatedTarget;
      if (isExcluded(related, excludeRefsRef.current)) return;

      const currentTarget = event.currentTarget as HTMLElement;
      if (related && currentTarget.contains(related as Node)) return;

      if (isFocusWithinRef.current) {
        isFocusWithinRef.current = false;
        onBlurWithin?.(event);
        onFocusWithinChange?.(false);
      }
    },
    [isDisabled, onBlurWithin, onFocusWithinChange],
  );

  return { onFocus, onBlur, isFocusWithin: () => isFocusWithinRef.current };
}
