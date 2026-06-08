import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

export interface ListScrollOverflow {
  canScrollUp: boolean;
  canScrollDown: boolean;
  update: () => void;
}

export function useListScrollOverflow(
  listRef: RefObject<HTMLUListElement | null>,
  enabled: boolean,
): ListScrollOverflow {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const update = useCallback(() => {
    const list = listRef.current;
    if (!list) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = list;
    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
  }, [listRef]);

  useLayoutEffect(() => {
    if (!enabled) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    update();

    const list = listRef.current;
    if (!list) return;

    list.addEventListener("scroll", update, { passive: true });

    const observer = new ResizeObserver(update);
    observer.observe(list);

    return () => {
      list.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [enabled, listRef, update]);

  return { canScrollUp, canScrollDown, update };
}