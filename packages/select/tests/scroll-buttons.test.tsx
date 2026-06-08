import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Select from "../src/index.parts";
import { useSelectContext } from "../src/context";

const ITEMS = Array.from({ length: 30 }, (_, index) => ({
  value: `item-${index}`,
  label: `Item ${index}`,
}));

function mockListOverflow(list: HTMLElement, scrollTop = 0) {
  let currentScrollTop = scrollTop;

  Object.defineProperty(list, "clientHeight", { configurable: true, value: 120 });
  Object.defineProperty(list, "scrollHeight", { configurable: true, value: 600 });
  Object.defineProperty(list, "scrollTop", {
    configurable: true,
    get() {
      return currentScrollTop;
    },
    set(value: number) {
      currentScrollTop = value;
    },
  });
}

function LongListSelect({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <Select.Root defaultOpen={defaultOpen}>
      <Select.Trigger>
        <Select.Value placeholder="Pick…" />
      </Select.Trigger>
      <Select.Content data-testid="content">
        <Select.ScrollUpButton data-testid="scroll-up" keepMounted />
        <Select.List
          data-testid="list"
          style={{ maxHeight: 120, overflowY: "auto", margin: 0, padding: 0, listStyle: "none" }}
        >
          {ITEMS.map(({ value, label }) => (
            <Select.Item key={value} value={value} style={{ padding: "8px 12px" }}>
              <Select.ItemText>{label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.List>
        <Select.ScrollDownButton data-testid="scroll-down" keepMounted />
      </Select.Content>
    </Select.Root>
  );
}

describe("Scroll buttons", () => {
  it("shows scroll down button when the list overflows", async () => {
    render(<LongListSelect />);

    const list = screen.getByTestId("list");
    mockListOverflow(list);
    fireEvent.scroll(list);

    const scrollDown = screen.getByTestId("scroll-down");
    expect(scrollDown).toHaveAttribute("data-visible", "true");
    expect(screen.getByTestId("scroll-up")).toHaveAttribute("data-visible", "false");
  });

  it("scrolls the list when scroll down button is clicked", async () => {
    const user = userEvent.setup();
    render(<LongListSelect />);

    const list = screen.getByTestId("list");
    mockListOverflow(list);
    fireEvent.scroll(list);

    const initialScrollTop = list.scrollTop;
    await user.click(screen.getByTestId("scroll-down"));

    expect(list.scrollTop).toBeGreaterThan(initialScrollTop);
  });

  it("scrolls the list up after scrolling down", async () => {
    const user = userEvent.setup();
    render(<LongListSelect />);

    const list = screen.getByTestId("list");
    mockListOverflow(list);
    fireEvent.scroll(list);

    await user.click(screen.getByTestId("scroll-down"));
    const scrollTopAfterDown = list.scrollTop;
    expect(scrollTopAfterDown).toBeGreaterThan(0);

    // keepMounted ensures the up button stays in the DOM for interaction
    await user.click(screen.getByTestId("scroll-up"));
    expect(list.scrollTop).toBeLessThan(scrollTopAfterDown);
  });
});

describe("scrollToIndex", () => {
  it("scrolls to the requested index via context helper", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    function ScrollToIndexHarness() {
      const { scrollToIndex } = useSelectContext();

      return (
        <button type="button" data-testid="scroll-btn" onClick={() => scrollToIndex(10)}>
          Scroll
        </button>
      );
    }

    render(
      <Select.Root defaultOpen>
        <Select.Trigger>
          <Select.Value placeholder="Pick…" />
        </Select.Trigger>
        <Select.Content>
          <ScrollToIndexHarness />
          <Select.List>
            {ITEMS.map(({ value, label }) => (
              <Select.Item key={value} value={value}>
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select.Root>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId("scroll-btn"));

    expect(scrollIntoView).toHaveBeenCalled();
  });
});