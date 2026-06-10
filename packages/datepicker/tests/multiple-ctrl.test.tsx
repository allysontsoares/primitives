import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as DatePicker from "../src/date-picker/index";

describe("multiple Ctrl+click", () => {
  it("toggles dates with Ctrl+click without using input clear flow", async () => {
    const onChange = vi.fn();
    render(
      <DatePicker.Root mode="multiple" defaultOpen closeOnSelect={false} onValueChange={onChange}>
        <DatePicker.Input />
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );

    const day10 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "10" && !c.hasAttribute("data-outside-month"));
    const day15 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "15" && !c.hasAttribute("data-outside-month"));

    fireEvent.click(day10!, { ctrlKey: true });
    fireEvent.click(day15!, { ctrlKey: true });

    expect(onChange).toHaveBeenCalled();
    const last = onChange.mock.calls.at(-1)?.[0] as Date[];
    expect(last?.length).toBe(2);
  });
});
