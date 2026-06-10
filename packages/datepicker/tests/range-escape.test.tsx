import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as DatePicker from "../src/date-picker/index";

function RangePicker({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <DatePicker.Root mode="range" defaultOpen={defaultOpen} closeOnSelect={false}>
      <DatePicker.Label>Range</DatePicker.Label>
      <DatePicker.Input index={0} />
      <DatePicker.Input index={1} />
      <DatePicker.Trigger data-testid="trigger">Open</DatePicker.Trigger>
      <DatePicker.Content forceMount>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

describe("range Escape", () => {
  it("cancels pending range anchor without closing", async () => {
    const user = userEvent.setup();
    render(<RangePicker />);

    const day10 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "10" && !c.hasAttribute("data-outside-month"));
    await user.click(day10!);
    expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "true");

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();
    await user.keyboard("{Escape}");

    expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "true");
    expect(document.querySelector('[data-range-start="true"]')).toBeNull();
  });
});
