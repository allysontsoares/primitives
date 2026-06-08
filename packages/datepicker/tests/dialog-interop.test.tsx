import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  MockDialog,
  MockDialogBody,
  MockDialogNextField,
} from "../../utils/tests/fixtures/dialog-interop";
import * as DatePicker from "../src/date-picker/index";

function PickerInDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <MockDialog label="Schedule event">
      <h2 id="dialog-title">Schedule event</h2>
      <MockDialogBody>
        <DatePicker.Root defaultValue={new Date(2024, 5, 15)} defaultOpen={defaultOpen}>
          <DatePicker.Label>Event date</DatePicker.Label>
          <DatePicker.Input />
          <DatePicker.Trigger>Open</DatePicker.Trigger>
          <DatePicker.Content forceMount data-testid="picker-content">
            <DatePicker.Calendar />
          </DatePicker.Content>
        </DatePicker.Root>
        <MockDialogNextField />
      </MockDialogBody>
    </MockDialog>
  );
}

describe("DatePicker dialog interop (popup-policy matrix)", () => {
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

  it("Escape closes DatePicker but NOT the parent dialog (stopPropagation)", async () => {
    const user = userEvent.setup();
    render(<PickerInDialog defaultOpen />);

    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "false");
  });

  it("does not portal content outside the mock dialog by default", async () => {
    const user = userEvent.setup();
    render(<PickerInDialog />);

    await user.click(screen.getByRole("button", { name: "Open" }));

    const pickerContent = screen.getByTestId("picker-content");
    const parentDialog = screen.getByTestId("mock-dialog");

    expect(parentDialog.contains(pickerContent)).toBe(true);
    expect(pickerContent.parentElement?.closest('[data-testid="mock-dialog"]')).toBe(parentDialog);
  });

  it("does not set aria-modal on content when modal=false (popup-policy default)", async () => {
    const user = userEvent.setup();
    render(<PickerInDialog />);

    await user.click(screen.getByRole("button", { name: "Open" }));

    const pickerDialog = screen.getByRole("dialog", { name: /event date/i });
    expect(pickerDialog).not.toHaveAttribute("aria-modal", "true");
  });

  it("Tab eventually reaches the next field without unmounting the parent dialog", async () => {
    const user = userEvent.setup();
    render(<PickerInDialog defaultOpen />);

    const content = screen.getByTestId("picker-content");
    content.focus();

    const nextField = screen.getByTestId("next-field");
    for (let i = 0; i < 40; i++) {
      if (document.activeElement === nextField) break;
      await user.tab();
    }

    expect(nextField).toHaveFocus();
    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
  });
});