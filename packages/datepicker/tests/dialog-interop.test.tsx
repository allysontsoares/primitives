import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as DatePicker from "../src/date-picker/index";

/**
 * Minimal mock dialog container — simulates an overlay that owns focus scope
 * (e.g. Radix Dialog.Content) without pulling in a third-party dialog primitive.
 * Smoke test for popup-policy: inline content stays inside the dialog subtree.
 */
function MockDialog({ children }: { children: React.ReactNode }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Schedule event" data-testid="mock-dialog">
      <h2 id="dialog-title">Schedule event</h2>
      <div data-testid="dialog-body">{children}</div>
    </div>
  );
}

function PickerInDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <MockDialog>
      <DatePicker.Root defaultValue={new Date(2024, 5, 15)} defaultOpen={defaultOpen}>
        <DatePicker.Label>Event date</DatePicker.Label>
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount data-testid="picker-content">
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>
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