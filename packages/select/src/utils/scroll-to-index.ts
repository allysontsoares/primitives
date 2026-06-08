import type { ScrollToIndexAlign, ScrollToIndexOptions, SelectStoreState } from "../types";

function toScrollBlock(align: ScrollToIndexAlign): ScrollLogicalPosition {
  switch (align) {
    case "start":
      return "start";
    case "end":
      return "end";
    case "center":
      return "center";
    case "nearest":
    case "auto":
    default:
      return "nearest";
  }
}

export function scrollToIndexInState(
  state: SelectStoreState,
  index: number,
  options: ScrollToIndexOptions = {},
): void {
  const items = Array.from(state.items.values());
  const item = items[index];
  if (!item?.ref) return;

  item.ref.scrollIntoView({
    block: toScrollBlock(options.align ?? "nearest"),
  });
}