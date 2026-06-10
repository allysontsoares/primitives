import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as DatePicker from "../src/date-picker/index";

function UnavailablePicker({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const unavailable = (date: Date) => date.getDate() === 15;
  return (
    <DatePicker.Root
      defaultValue={new Date(2024, 5, 10)}
      defaultOpen={defaultOpen}
      unavailable={unavailable}
    >
      <DatePicker.Label>Date</DatePicker.Label>
      <DatePicker.Input />
      <DatePicker.Trigger>Open</DatePicker.Trigger>
      <DatePicker.Content forceMount>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

describe("unavailable dates", () => {
  it("marks unavailable cells with data-unavailable", () => {
    render(<UnavailablePicker />);
    const unavailable = document.querySelector('[data-unavailable="true"]');
    expect(unavailable).toBeTruthy();
    expect(unavailable?.textContent?.trim()).toBe("15");
  });

  it("does not set aria-disabled on unavailable (only on disabled)", () => {
    render(<UnavailablePicker />);
    const unavailable = document.querySelector('[data-unavailable="true"]');
    expect(unavailable).not.toHaveAttribute("aria-disabled", "true");
  });

  it("includes unavailable in aria-label", () => {
    render(<UnavailablePicker />);
    const cell = screen.getByRole("gridcell", { name: /unavailable/i });
    expect(cell.textContent?.trim()).toBe("15");
  });

  it("does not select unavailable date on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker.Root defaultOpen onValueChange={onChange} unavailable={(d) => d.getDate() === 15}>
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );
    const cell = screen.getByRole("gridcell", { name: /unavailable/i });
    await user.click(cell);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows focus on unavailable date", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker.Root
        defaultValue={new Date(2024, 5, 10)}
        defaultOpen
        closeOnSelect={false}
        unavailable={(date) => date.getDate() === 15}
      >
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );
    const grid = screen.getAllByRole("grid").find((g) => g.tagName === "TABLE")!;
    const start = grid.querySelector<HTMLElement>('[tabindex="0"]');
    start?.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}");
    const focused = grid.querySelector<HTMLElement>('[tabindex="0"]');
    expect(focused?.textContent?.trim()).toBe("15");
    expect(focused).toHaveAttribute("data-unavailable", "true");
  });
});
