import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useState } from "react";
import * as DatePicker from "../src/date-picker/index";
import type { DatePickerSingleProps } from "../src/types";
import { useDatePickerActions } from "../src/date-picker/use-date-picker-actions";
import { isSameDay } from "../src/utils/date";

function BasicPicker(props: DatePickerSingleProps & { defaultOpen?: boolean }) {
  return (
    <DatePicker.Root {...props}>
      <DatePicker.Input />
      <DatePicker.Content forceMount>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

describe("Tier 4 — controlled multiple", () => {
  it("syncs controlled value into calendar selection", async () => {
    const dates = [new Date(2024, 5, 10), new Date(2024, 5, 12)];

    function Controlled() {
      const [value, setValue] = useState(dates);
      return (
        <DatePicker.Root
          mode="multiple"
          value={value}
          onValueChange={setValue}
          defaultOpen
          placeholderDate={new Date(2024, 5, 10)}
        >
          <DatePicker.Content forceMount>
            <DatePicker.Calendar />
          </DatePicker.Content>
        </DatePicker.Root>
      );
    }

    render(<Controlled />);
    await waitFor(() => {
      expect(document.querySelectorAll('[data-selected="true"]')).toHaveLength(2);
    });

    const day15 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "15" && !c.hasAttribute("data-outside-month"));
    fireEvent.click(day15!);

    await waitFor(() => {
      expect(document.querySelectorAll('[data-selected="true"]')).toHaveLength(3);
    });
  });
});

describe("Tier 4 — pageBehavior", () => {
  it("single mode keeps June visible when July date is still in the grid", async () => {
    const user = userEvent.setup();
    render(
      <BasicPicker
        mode="single"
        defaultOpen
        defaultValue={new Date(2024, 5, 5)}
        pageBehavior="single"
      />,
    );

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    expect(grid.getAttribute("aria-label")).toMatch(/june/i);

    const june5 = screen.getByRole("gridcell", { name: /june 5/i });
    june5.focus();
    await user.keyboard("{PageDown}");

    expect(grid.getAttribute("aria-label")).toMatch(/june/i);
    expect(screen.getByRole("gridcell", { name: /july 5/i })).toHaveAttribute("tabindex", "0");
  });
});

describe("Tier 4 — allowsNonContiguousRanges", () => {
  const unavailable = (date: Date) => date.getDate() === 12;

  it("blocks range completion across unavailable dates by default", async () => {
    const onChange = vi.fn();

    render(
      <DatePicker.Root
        mode="range"
        defaultOpen
        placeholderDate={new Date(2024, 5, 1)}
        unavailable={unavailable}
        onValueChange={onChange}
        closeOnSelect={false}
      >
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );

    const day10 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "10" && !c.hasAttribute("data-outside-month"));
    const day14 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "14" && !c.hasAttribute("data-outside-month"));
    fireEvent.click(day10!);
    fireEvent.click(day14!);

    const last = onChange.mock.calls.at(-1)?.[0] as { start: Date | null; end: Date | null };
    expect(last?.end).toBeNull();
  });

  it("allows range completion when allowsNonContiguousRanges is true", async () => {
    const onChange = vi.fn();

    render(
      <DatePicker.Root
        mode="range"
        defaultOpen
        placeholderDate={new Date(2024, 5, 1)}
        unavailable={unavailable}
        allowsNonContiguousRanges
        onValueChange={onChange}
        closeOnSelect={false}
      >
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );

    const day10 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "10" && !c.hasAttribute("data-outside-month"));
    const day14 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "14" && !c.hasAttribute("data-outside-month"));
    fireEvent.click(day10!);
    fireEvent.click(day14!);

    const last = onChange.mock.calls.at(-1)?.[0] as { start: Date | null; end: Date | null };
    expect(last?.start).toBeTruthy();
    expect(last?.end).toBeTruthy();
  });
});

describe("Tier 4 — Presets", () => {
  function PresetButtons() {
    const { selectToday, selectDaysFromToday } = useDatePickerActions();
    return (
      <>
        <button type="button" onClick={selectToday}>
          Today
        </button>
        <button type="button" onClick={() => selectDaysFromToday(7)}>
          +7 days
        </button>
      </>
    );
  }

  it("renders presets group and applies preset selection", async () => {
    const onChange = vi.fn();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    render(
      <DatePicker.Root defaultOpen onValueChange={onChange}>
        <DatePicker.Content forceMount>
          <DatePicker.Presets>
            <PresetButtons />
          </DatePicker.Presets>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );

    expect(screen.getByRole("group", { name: /date presets/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Today" }));

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    const selected = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(isSameDay(selected, today)).toBe(true);
  });
});

describe("Tier 4 — granularity", () => {
  it("renders hour and minute segments when granularity is minute", () => {
    render(
      <DatePicker.Root granularity="minute" defaultValue={new Date(2024, 5, 15, 14, 30)}>
        <DatePicker.Input />
      </DatePicker.Root>,
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments.length).toBeGreaterThanOrEqual(5);
    expect(screen.getByRole("group")).toContainElement(segments[3]!);
    expect(screen.getByRole("group")).toContainElement(segments[4]!);
  });
});
