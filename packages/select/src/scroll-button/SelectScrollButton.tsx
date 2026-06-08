import React, { useCallback } from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";
import { useListScrollOverflow } from "../utils/use-list-scroll-overflow";
import type { SelectScrollButtonProps } from "../types";

const SCROLL_STEP_PX = 40;

export function ScrollButton({
  direction,
  keepMounted = false,
  onClick,
  children,
  style,
  ...props
}: SelectScrollButtonProps) {
  const { store, refs } = useSelectContext();
  const open = useSelectStore(store, (s) => s.open);
  const isUp = direction === "up";

  const { canScrollUp, canScrollDown, update } = useListScrollOverflow(refs.listRef, open);
  const visible = isUp ? canScrollUp : canScrollDown;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const list = refs.listRef.current;
      if (list) {
        const delta = isUp ? -SCROLL_STEP_PX : SCROLL_STEP_PX;
        if (typeof list.scrollBy === "function") {
          list.scrollBy({ top: delta, behavior: "smooth" });
        } else {
          list.scrollTop += delta;
        }
        list.dispatchEvent(new Event("scroll"));
        update();
      }
      onClick?.(event);
    },
    [isUp, onClick, refs.listRef, update],
  );

  if (!visible && !keepMounted) {
    return null;
  }

  return (
    <button
      type="button"
      aria-hidden
      tabIndex={-1}
      data-direction={direction}
      data-visible={visible ? "true" : "false"}
      style={{
        display: visible || keepMounted ? undefined : "none",
        ...style,
      }}
      onClick={handleClick}
      {...props}
    >
      {children ?? (isUp ? "▲" : "▼")}
    </button>
  );
}