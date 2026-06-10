import { createElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGridNavigation } from "../src/composite/use-grid-navigation";

function GridHarness({
  columns = 3,
  itemCount = 6,
  focusedIndex = 0,
  direction = "ltr" as const,
  onFocusedIndexChange,
  onSelect,
}: {
  columns?: number;
  itemCount?: number;
  focusedIndex?: number;
  direction?: "ltr" | "rtl";
  onFocusedIndexChange?: (index: number) => void;
  onSelect?: (index: number) => void;
}) {
  const { onKeyDown } = useGridNavigation({
    columns,
    itemCount,
    focusedIndex,
    direction,
    onFocusedIndexChange: onFocusedIndexChange ?? (() => {}),
    ...(onSelect !== undefined && { onSelect }),
  });

  return createElement(
    "div",
    { role: "grid", tabIndex: 0, onKeyDown },
    Array.from({ length: itemCount }, (_, i) =>
      createElement(
        "button",
        {
          key: i,
          type: "button",
          role: "gridcell",
          tabIndex: i === focusedIndex ? 0 : -1,
        },
        String(i + 1),
      ),
    ),
  );
}

describe("useGridNavigation", () => {
  it("ArrowRight moves focus index forward in LTR", () => {
    const onChange = vi.fn();
    render(createElement(GridHarness, { focusedIndex: 1, onFocusedIndexChange: onChange }));
    const grid = screen.getByRole("grid");
    fireEvent.keyDown(grid, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("ArrowRight moves focus index backward in RTL", () => {
    const onChange = vi.fn();
    render(
      createElement(GridHarness, {
        focusedIndex: 2,
        direction: "rtl",
        onFocusedIndexChange: onChange,
      }),
    );
    fireEvent.keyDown(screen.getByRole("grid"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("Enter calls onSelect with focused index", () => {
    const onSelect = vi.fn();
    render(createElement(GridHarness, { focusedIndex: 3, onSelect }));
    fireEvent.keyDown(screen.getByRole("grid"), { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(3);
  });
});
