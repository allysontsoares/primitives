import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as DatePicker from "../src/date-picker/index";

function BasicPicker({
  defaultOpen = true,
  defaultValue = new Date(2024, 5, 15), // June 15, 2024
  onValueChange,
}: {
  defaultOpen?: boolean;
  defaultValue?: Date | null;
  onValueChange?: (d: Date | null) => void;
}) {
  return (
    <DatePicker.Root
      mode="single"
      {...(defaultValue != null ? { defaultValue } : {})}
      defaultOpen={defaultOpen}
      {...(onValueChange !== undefined ? { onValueChange } : {})}
    >
      <DatePicker.Label>Date</DatePicker.Label>
      <DatePicker.Input data-testid="input" />
      <DatePicker.Trigger data-testid="trigger">Open</DatePicker.Trigger>
      <DatePicker.Content forceMount data-testid="content">
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

// Helper to get the three spinbutton segments from the input group
function getSegments() {
  return screen.getAllByRole("spinbutton");
}

describe("Trigger", () => {
  it("opens the calendar on click", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen={false} />);
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the calendar on second click", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    const trigger = screen.getByTestId("trigger");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Input (segmented) — rendering", () => {
  it("shows placeholder text when no value", () => {
    render(<BasicPicker defaultValue={null} />);
    const segments = screen.getAllByRole("spinbutton");
    const placeholders = segments.map((s) => s.getAttribute("placeholder"));
    expect(placeholders.some((p) => p?.includes("mm"))).toBe(true);
    expect(placeholders.some((p) => p?.includes("dd"))).toBe(true);
    expect(placeholders.some((p) => p?.includes("yyyy"))).toBe(true);
  });

  it("shows formatted date when value is set (en-US order: MM DD YYYY)", () => {
    render(<BasicPicker />);
    const segments = screen.getAllByRole("spinbutton");
    // en-US: month/day/year order
    const texts = segments.map((s) => (s as HTMLInputElement).value);
    expect(texts.some((t) => t === "06" || t === "6")).toBe(true);
    expect(texts.some((t) => t === "15")).toBe(true);
    expect(texts.some((t) => t === "2024")).toBe(true);
  });

  it("opening calendar on segment focus", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen={false} />);
    expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "false");
    const [firstSegment] = getSegments();
    await user.click(firstSegment!);
    expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "true");
  });
});

describe("Input keyboard — digit entry", () => {
  it("typing a single digit ≥ 2 in month auto-commits and advances", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={null} defaultOpen={false} />);
    const segments = getSegments(); // [month, day, year] for en-US
    const monthSeg = segments[0]!;
    await user.click(monthSeg); // use userEvent.click to properly wrap in act()
    await user.keyboard("3"); // digit ≥ 2 → auto-commit month=3, focus day
    // Month should now show '03'
    expect((monthSeg as HTMLInputElement).value).toBe("03");
    // Focus should have moved to day
    expect(document.activeElement?.getAttribute("data-segment")).toBe("day");
  });

  it("typing two digits in month commits combined value", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={null} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    await user.click(monthSeg);
    await user.keyboard("1"); // pending='1', wait
    await user.keyboard("2"); // combined=12 → commit, advance
    expect((monthSeg as HTMLInputElement).value).toBe("12");
    expect(document.activeElement?.getAttribute("data-segment")).toBe("day");
  });

  it("ArrowUp increments the focused segment", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    await user.click(monthSeg);
    await user.keyboard("{ArrowUp}");
    // June (6) → July (7)
    expect(monthSeg).toHaveAttribute("aria-valuenow", "7");
  });

  it("ArrowDown decrements the focused segment", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    await user.click(monthSeg);
    await user.keyboard("{ArrowDown}");
    // June (6) → May (5)
    expect(monthSeg).toHaveAttribute("aria-valuenow", "5");
  });

  it("ArrowUp on month 12 wraps to 1", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 11, 1)} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    await user.click(monthSeg);
    await user.keyboard("{ArrowUp}");
    expect(monthSeg).toHaveAttribute("aria-valuenow", "1");
  });

  it("ArrowLeft moves focus to previous segment", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments();
    const daySeg = segments[1]!;
    // Focus day segment directly (it has tabIndex=-1 initially, use act() wrapper)
    await act(async () => {
      daySeg.focus();
    });
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement?.getAttribute("data-segment")).toBe("month");
  });

  it("ArrowRight moves focus to next segment", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    await user.click(monthSeg);
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement?.getAttribute("data-segment")).toBe("day");
  });

  it("Backspace clears the focused segment", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    await user.click(monthSeg);
    await user.keyboard("{Backspace}");
    expect((monthSeg as HTMLInputElement).value).toBe("");
  });

  it("Escape closes calendar when open", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    const segments = getSegments();
    await user.click(segments[0]!);
    await user.keyboard("{Escape}");
    expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "false");
  });

  it("filling all segments dispatches date and calls onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker.Root onValueChange={onChange}>
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount />
      </DatePicker.Root>,
    );
    const segments = screen.getAllByRole("spinbutton");
    // en-US: month, day, year
    const [monthSeg, _daySeg, yearSeg] = segments;

    // Type month=07, day=04, year=2024. Month and day auto-advance.
    await user.click(monthSeg!);
    await user.keyboard("07");
    await user.keyboard("04");
    expect(document.activeElement).toBe(yearSeg);
    await user.keyboard("2024");

    expect(onChange).toHaveBeenCalled();
    const called = onChange.mock.calls[0]?.[0] as Date;
    expect(called?.getMonth()).toBe(6); // July
    expect(called?.getDate()).toBe(4);
    expect(called?.getFullYear()).toBe(2024);
  });
});

describe("Input keyboard — pre-filled date (grid focus-steal regression)", () => {
  // Regression: when a date is already filled, typing in a segment dispatches FOCUS_DATE
  // which used to trigger grid.tsx's useEffect to steal focus from the segment.
  it("changing month keeps focus on day segment after auto-advance", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments(); // [month, day, year]
    const monthSeg = segments[0]!;
    const daySeg = segments[1]!;
    await user.click(monthSeg);
    // Type '01' → month commits as 1, focus advances to day
    await user.keyboard("0");
    await user.keyboard("1");
    expect((monthSeg as HTMLInputElement).value).toBe("01");
    // Focus must stay on day segment (not stolen by calendar grid)
    expect(document.activeElement).toBe(daySeg);
    expect(document.activeElement?.getAttribute("data-segment")).toBe("day");
  });

  it("typing leading-zero month (05) keeps focus in the input", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    const daySeg = segments[1]!;
    await user.click(monthSeg);
    await user.keyboard("0");
    await user.keyboard("5");
    expect((monthSeg as HTMLInputElement).value).toBe("05");
    expect(document.activeElement).toBe(daySeg);
  });

  it("ArrowUp on pre-filled segment keeps focus on that segment", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultValue={new Date(2024, 5, 15)} defaultOpen={false} />);
    const segments = getSegments();
    const monthSeg = segments[0]!;
    await user.click(monthSeg);
    await user.keyboard("{ArrowUp}");
    // June(6)+1 = July(7)
    expect(monthSeg).toHaveAttribute("aria-valuenow", "7");
    // Focus must NOT move to the calendar grid
    expect(document.activeElement).toBe(monthSeg);
  });
});

describe("Input ← Calendar sync", () => {
  it("clicking a calendar day updates the segments", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen defaultValue={new Date(2024, 5, 15)} />);

    // Click on day 20
    const cells = screen.getAllByRole("gridcell");
    const day20 = cells.find(
      (c) => c.textContent?.trim() === "20" && !c.hasAttribute("data-outside-month"),
    );
    await user.click(day20!);

    // Re-query after click: Segments remounts (timescapeKey++) so previous
    // references are detached. Must query fresh DOM nodes.
    const daySegInput = screen
      .getAllByRole("spinbutton")
      .find((s) => s.getAttribute("data-segment") === "day") as HTMLInputElement | undefined;
    expect(daySegInput?.value).toBe("20");
  });
});

describe("Calendar navigation", () => {
  it("PrevTrigger navigates to previous month", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    const grid = screen.getAllByRole("grid").find((el) => el.tagName === "TABLE")!;
    expect(grid.getAttribute("aria-label")).toMatch(/june/i);
    await user.click(screen.getByRole("button", { name: /previous month/i }));
    expect(grid.getAttribute("aria-label")).toMatch(/may/i);
  });

  it("NextTrigger navigates to next month", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    const grid = screen.getAllByRole("grid").find((el) => el.tagName === "TABLE")!;
    await user.click(screen.getByRole("button", { name: /next month/i }));
    expect(grid.getAttribute("aria-label")).toMatch(/july/i);
  });

  it("ViewTrigger switches to month view", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    await user.click(screen.getByRole("button", { name: /switch to month view/i }));
    const grids = screen.getAllByRole("grid");
    const monthGrid = grids.find((g) => g.getAttribute("aria-label") === "2024");
    expect(monthGrid).toBeInTheDocument();
  });

  it("selecting a month returns to day view", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    await user.click(screen.getByRole("button", { name: /switch to month view/i }));
    const augustCell = screen.getByRole("gridcell", { name: /august/i });
    await user.click(augustCell);
    const grid = screen.getAllByRole("grid").find((el) => el.tagName === "TABLE")!;
    expect(grid.getAttribute("aria-label")).toMatch(/august/i);
  });
});

describe("Day selection", () => {
  it("clicking a day selects it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BasicPicker defaultOpen onValueChange={onChange} />);

    const cells = screen.getAllByRole("gridcell");
    const day20 = cells.find(
      (c) => c.textContent?.trim() === "20" && !c.hasAttribute("data-outside-month"),
    );
    expect(day20).toBeDefined();
    await user.click(day20!);
    expect(onChange).toHaveBeenCalled();
    const selected = onChange.mock.calls[0]?.[0] as Date;
    expect(selected?.getDate()).toBe(20);
  });

  it("closes calendar after single date selection (closeOnSelect default)", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    const cells = screen.getAllByRole("gridcell");
    const day10 = cells.find(
      (c) => c.textContent?.trim() === "10" && !c.hasAttribute("data-outside-month"),
    );
    await user.click(day10!);
    expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Grid keyboard navigation", () => {
  it("ArrowRight moves focus to next day", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();

    await user.keyboard("{ArrowRight}");

    const newFocused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    const prevDay = Number(focused?.textContent?.trim());
    const nextDay = Number(newFocused?.textContent?.trim());
    expect(nextDay === prevDay + 1 || nextDay === 1).toBe(true);
  });

  it("ArrowLeft moves focus to previous day", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();

    const prevDay = Number(focused?.textContent?.trim());
    await user.keyboard("{ArrowLeft}");

    const newFocused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    const nextDay = Number(newFocused?.textContent?.trim());
    expect(nextDay === prevDay - 1 || nextDay > 27).toBe(true);
  });

  it("ArrowDown moves focus one week forward", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();

    const prevDay = Number(focused?.textContent?.trim());
    await user.keyboard("{ArrowDown}");

    const newFocused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    const nextDay = Number(newFocused?.textContent?.trim());
    expect(nextDay === prevDay + 7 || nextDay < 10).toBe(true);
  });

  it("PageDown navigates to next month", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    expect(grid.getAttribute("aria-label")).toMatch(/june/i);

    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();
    await user.keyboard("{PageDown}");

    expect(grid.getAttribute("aria-label")).toMatch(/july/i);
  });

  it("PageUp navigates to previous month", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();
    await user.keyboard("{PageUp}");

    expect(grid.getAttribute("aria-label")).toMatch(/may/i);
  });

  it("Escape closes calendar from grid", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();
    await user.keyboard("{Escape}");

    expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "false");
  });

  it("Enter on a day cell selects it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BasicPicker defaultOpen onValueChange={onChange} />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalled();
  });
});

describe("Month grid keyboard navigation", () => {
  it("ArrowRight prevents default page scroll while moving focus", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    await user.click(screen.getByRole("button", { name: /switch to month view/i }));

    const monthGrid = screen.getByRole("grid", { name: "2024" });
    const focused = monthGrid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();

    const preventDefault = vi.spyOn(KeyboardEvent.prototype, "preventDefault");
    await user.keyboard("{ArrowRight}");
    expect(preventDefault).toHaveBeenCalled();
    preventDefault.mockRestore();
  });
});

describe("Keyboard: header ↔ grid traversal across views", () => {
  function activeRole() {
    return document.activeElement?.getAttribute("role");
  }

  // The ViewControl order is Prev → ViewTrigger → Next, so the Next button is the
  // last header tab stop; Tab from it must enter the grid below.
  function tabFromHeaderInto(grid: HTMLElement, nextName: RegExp) {
    screen.getByRole("button", { name: nextName }).focus();
    return grid;
  }

  it("Tab from a header button returns focus into the day grid", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    screen.getByRole("button", { name: /next month/i }).focus();

    // The grid is a single tab stop (roving tabindex) — Tab lands on the focused day.
    await user.tab();

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    expect(grid.contains(document.activeElement)).toBe(true);
    expect(activeRole()).toBe("gridcell");
  });

  it("cycles day → month → year → day via the ViewTrigger and Tab returns to the grid in each view", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);

    // Day view is shown initially.
    const dayGrid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    expect(dayGrid.getAttribute("aria-label")).toMatch(/june/i);

    // day → month (Enter on the focused ViewTrigger).
    screen.getByRole("button", { name: /switch to month view/i }).focus();
    await user.keyboard("{Enter}");
    const monthGrid = screen.getByRole("grid", { name: "2024" });
    expect(monthGrid).toBeInTheDocument();

    // Tab from the header lands in the month grid (focused month cell).
    tabFromHeaderInto(monthGrid, /next year/i);
    await user.tab();
    expect(monthGrid.contains(document.activeElement)).toBe(true);
    expect(activeRole()).toBe("gridcell");

    // month → year.
    screen.getByRole("button", { name: /switch to year view/i }).focus();
    await user.keyboard("{Enter}");
    const yearGrid = screen
      .getAllByRole("grid")
      .find((g) => /\d{4}.*\d{4}/.test(g.getAttribute("aria-label") ?? ""))!;
    expect(yearGrid).toBeDefined();

    // Tab from the header lands in the year grid (focused year cell).
    tabFromHeaderInto(yearGrid, /next years/i);
    await user.tab();
    expect(yearGrid.contains(document.activeElement)).toBe(true);
    expect(activeRole()).toBe("gridcell");

    // year → day (the ViewTrigger cycles back to the day view).
    screen.getByRole("button", { name: /switch to day view/i }).focus();
    await user.keyboard("{Enter}");
    const dayGridAgain = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    expect(dayGridAgain.getAttribute("aria-label")).toMatch(/june/i);

    // And Tab from the header returns into the day grid again.
    screen.getByRole("button", { name: /next month/i }).focus();
    await user.tab();
    expect(dayGridAgain.contains(document.activeElement)).toBe(true);
    expect(activeRole()).toBe("gridcell");
  });
});

describe("Grid keyboard — crossing month boundaries (FX-2)", () => {
  it("ArrowUp on the first row navigates into the previous month", async () => {
    const user = userEvent.setup();
    // June 1, 2024 sits on the top row; ArrowUp must cross into May.
    render(<BasicPicker defaultOpen defaultValue={new Date(2024, 5, 1)} />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();
    expect(grid.getAttribute("aria-label")).toMatch(/june/i);

    await user.keyboard("{ArrowUp}");

    expect(grid.getAttribute("aria-label")).toMatch(/may/i);
  });

  it("ArrowLeft on the first day navigates into the previous month", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen defaultValue={new Date(2024, 5, 1)} />);

    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    focused?.focus();

    await user.keyboard("{ArrowLeft}");

    expect(grid.getAttribute("aria-label")).toMatch(/may/i);
  });
});

describe("Range selection by click (FX-1)", () => {
  function RangePicker({ onValueChange }: { onValueChange?: (r: unknown) => void }) {
    return (
      <DatePicker.Root
        mode="range"
        defaultOpen
        closeOnSelect={false}
        {...(onValueChange ? { onValueChange } : {})}
      >
        <DatePicker.Input index={0} />
        <DatePicker.Input index={1} />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>
    );
  }

  function dayCell(n: number) {
    return screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === String(n) && !c.hasAttribute("data-outside-month"));
  }

  it("first click anchors, second click completes the range", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangePicker onValueChange={onChange} />);

    await user.click(dayCell(10)!);
    // Anchor set, no end yet.
    expect(dayCell(10)).toHaveAttribute("data-range-start");

    await user.click(dayCell(15)!);

    expect(dayCell(10)).toHaveAttribute("data-range-start");
    expect(dayCell(15)).toHaveAttribute("data-range-end");
    expect(dayCell(12)).toHaveAttribute("data-in-range");

    const last = onChange.mock.calls.at(-1)?.[0] as { start: Date; end: Date };
    expect(last.start.getDate()).toBe(10);
    expect(last.end.getDate()).toBe(15);
  });

  it("clicking a third date after a complete range starts a new range", async () => {
    const user = userEvent.setup();
    render(<RangePicker />);

    await user.click(dayCell(10)!);
    await user.click(dayCell(15)!);
    await user.click(dayCell(20)!);

    expect(dayCell(20)).toHaveAttribute("data-range-start");
    expect(dayCell(15)).not.toHaveAttribute("data-range-end");
  });

  it("press-and-drag selects a range in one gesture (FX-1b)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangePicker onValueChange={onChange} />);

    // Mouse down on day 10, drag onto day 18, release there.
    await user.pointer([
      { keys: "[MouseLeft>]", target: dayCell(10)! },
      { target: dayCell(18)! },
      { keys: "[/MouseLeft]", target: dayCell(18)! },
    ]);

    expect(dayCell(10)).toHaveAttribute("data-range-start");
    expect(dayCell(18)).toHaveAttribute("data-range-end");
    expect(dayCell(14)).toHaveAttribute("data-in-range");

    const last = onChange.mock.calls.at(-1)?.[0] as { start: Date; end: Date };
    expect(last.start.getDate()).toBe(10);
    expect(last.end.getDate()).toBe(18);
  });
});

describe("Year view navigation", () => {
  it("clicking ViewTrigger twice opens year view", async () => {
    const user = userEvent.setup();
    render(<BasicPicker defaultOpen />);
    await user.click(screen.getByRole("button", { name: /switch to month view/i })); // → month
    await user.click(screen.getByRole("button", { name: /switch to year view/i })); // → year
    const grids = screen.getAllByRole("grid");
    const yearGrid = grids.find((g) => /\d{4}.*\d{4}/.test(g.getAttribute("aria-label") ?? ""));
    expect(yearGrid).toBeInTheDocument();
  });
});
