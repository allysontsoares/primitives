import React, { useEffect } from "react";
import { useSelectContext } from "../context";

export type ListProps = React.HTMLAttributes<HTMLUListElement> & {
  /**
   * When set, scrolls the list to the item at this index.
   * Useful with virtualization or controlled scroll sync.
   */
  scrollToIndex?: number | undefined;
};

export function List({ children, scrollToIndex, ...props }: ListProps) {
  const { ids, refs, config, scrollToIndex: scrollToIndexFn } = useSelectContext();

  useEffect(() => {
    if (scrollToIndex == null || scrollToIndex < 0) return;
    scrollToIndexFn(scrollToIndex);
  }, [scrollToIndex, scrollToIndexFn]);

  return (
    <ul
      ref={refs.listRef}
      role="listbox"
      id={`${ids.content}-list`}
      aria-labelledby={ids.label}
      aria-multiselectable={config.multiple ? true : undefined}
      {...props}
    >
      {children}
    </ul>
  );
}
