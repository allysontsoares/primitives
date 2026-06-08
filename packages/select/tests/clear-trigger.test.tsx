import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Select from "../src/index.parts";

// ── Shared fixture (Tier 2: ClearTrigger) ───────────────────────────────────

function ClearableSelect({
  defaultValue = "react",
  onValueChange,
}: {
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}) {
  return (
    <Select.Root name="framework" defaultValue={defaultValue} onValueChange={onValueChange}>
      <Select.Label>Framework</Select.Label>
      <Select.Trigger data-testid="trigger">
        <Select.Value placeholder="Choose…" />
        <Select.ClearTrigger data-testid="clear" aria-label="Clear selection" />
      </Select.Trigger>
      <Select.Content data-testid="content">
        <Select.List>
          <Select.Item value="react">
            <Select.ItemText>React</Select.ItemText>
          </Select.Item>
          <Select.Item value="vue">
            <Select.ItemText>Vue</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Content>
      <Select.HiddenSelect />
    </Select.Root>
  );
}

// ── ClearTrigger ──────────────────────────────────────────────────────────────

describe("ClearTrigger", () => {
  it("renders a clear button", () => {
    render(<ClearableSelect />);
    expect(screen.getByTestId("clear")).toBeInTheDocument();
  });

  it("clears the selected value on click", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<ClearableSelect onValueChange={onValueChange} />);

    await user.click(screen.getByTestId("clear"));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it("shows placeholder after clearing", async () => {
    const user = userEvent.setup();
    render(<ClearableSelect />);

    await user.click(screen.getByTestId("clear"));
    expect(screen.getByText("Choose…")).toBeInTheDocument();
  });

  it("syncs hidden select after clearing", async () => {
    const user = userEvent.setup();
    render(<ClearableSelect />);

    await user.click(screen.getByTestId("clear"));
    const hidden = document.querySelector('select[name="framework"]') as HTMLSelectElement;
    expect(hidden.value).toBe("");
  });

  it("does not open the listbox when clicked", async () => {
    const user = userEvent.setup();
    render(<ClearableSelect />);

    await user.click(screen.getByTestId("clear"));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });
});