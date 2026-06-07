import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MockDialog } from "./fixtures/mock-dialog";
import * as DatePicker from "../src/date-picker/index";

function PickerInDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <MockDialog label="Schedule event">
      <h2 id="dialog-title">Schedule event</h2>
      <div data-testid="dialog-body">
      <DatePicker.Root defaultValue={new Date(2024, 5, 15)} defaultOpen={defaultOpen}>
        <DatePicker.Label>Event date</DatePicker.Label>
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount data-testid="picker-content">
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>
      </div>
    </MockDialog>
  );
}

describe("DatePicker dialog interop (popup-policy smoke)", () => {
  it("renders inline content inside the mock dialog container", async () => {
    const user = userEvent.setup();
    render(<PickerInDialog />);

    const dialog = screen.getByTestId("mock-dialog");
    const trigger = screen.getByRole("button", { name: "Open" });

    await user.click(trigger);

    const pickerDialog = within(dialog).getByRole("dialog", { name: /event date/i });
    expect(dialog.contains(pickerDialog)).toBe(true);
    expect(within(dialog).getByTestId("picker-content")).toBeInTheDocument();
  });

  it("keeps the parent mock dialog mounted when the picker closes via Escape", async () => {
    const user = userEvent.setup();
    render(<PickerInDialog defaultOpen />);

    const parentDialog = screen.getByTestId("mock-dialog");
    expect(parentDialog).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "false");
  });

  it("does not portal content to document.body by default", async () => {
    const user = userEvent.setup();
    render(<PickerInDialog />);

    await user.click(screen.getByRole("button", { name: "Open" }));

    const pickerContent = screen.getByTestId("picker-content");
    const parentDialog = screen.getByTestId("mock-dialog");

    expect(parentDialog.contains(pickerContent)).toBe(true);
    expect(document.body.contains(pickerContent)).toBe(true);
    expect(pickerContent.parentElement?.closest('[data-testid="mock-dialog"]')).toBe(parentDialog);
  });
});