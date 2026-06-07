import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MockDialog } from "./fixtures/mock-dialog";
import * as Select from "../src/index.parts";

function SelectInDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <MockDialog label="Settings">
      <h2>Settings</h2>
      <div data-testid="dialog-body">
        <Select.Root name="theme" defaultOpen={defaultOpen}>
          <Select.Label>Theme</Select.Label>
          <Select.Trigger data-testid="select-trigger">
            <Select.Value placeholder="Choose theme…" />
          </Select.Trigger>
          <Select.Content data-testid="select-content">
            <Select.List>
              <Select.Item value="light">
                <Select.ItemText>Light</Select.ItemText>
              </Select.Item>
              <Select.Item value="dark">
                <Select.ItemText>Dark</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Content>
          <Select.HiddenSelect />
        </Select.Root>
        <button type="button" data-testid="next-field">
          Next field
        </button>
      </div>
    </MockDialog>
  );
}

describe("Select dialog interop (popup-policy smoke)", () => {
  it("renders inline content inside the mock dialog container by default (portal=false)", async () => {
    const user = userEvent.setup();
    render(<SelectInDialog />);

    const dialog = screen.getByTestId("mock-dialog");
    await user.click(screen.getByTestId("select-trigger"));

    const selectContent = within(dialog).getByTestId("select-content");
    expect(dialog.contains(selectContent)).toBe(true);
  });

  it("keeps the parent dialog mounted when Select closes via Escape", async () => {
    const user = userEvent.setup();
    render(<SelectInDialog defaultOpen />);

    await user.keyboard("{Escape}");

    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("select-trigger")).toHaveAttribute("aria-expanded", "false");
  });

  it("Escape closes Select but NOT the parent dialog (stopPropagation)", async () => {
    const user = userEvent.setup();
    render(<SelectInDialog defaultOpen />);

    expect(screen.getByRole("dialog", { name: /settings/i })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: /settings/i })).toBeInTheDocument();
  });

  it("content does not portal to document.body by default", async () => {
    const user = userEvent.setup();
    render(<SelectInDialog />);

    await user.click(screen.getByTestId("select-trigger"));

    const selectContent = screen.getByTestId("select-content");
    const mockDialog = screen.getByTestId("mock-dialog");

    expect(mockDialog.contains(selectContent)).toBe(true);
    expect(selectContent.parentElement?.closest('[data-testid="mock-dialog"]')).toBe(mockDialog);
  });

  it("can navigate and select inside a dialog", async () => {
    const user = userEvent.setup();
    render(<SelectInDialog />);

    await user.click(screen.getByTestId("select-trigger"));
    const content = screen.getByTestId("select-content");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{Enter}");

    expect(screen.getByTestId("select-trigger")).toHaveAttribute("aria-expanded", "false");
  });

  it("Tab moves focus out without unmounting the parent dialog", async () => {
    const user = userEvent.setup();
    render(<SelectInDialog defaultOpen />);

    const content = screen.getByTestId("select-content");
    content.focus();
    await user.tab();

    expect(screen.getByTestId("next-field")).toHaveFocus();
    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
  });
});