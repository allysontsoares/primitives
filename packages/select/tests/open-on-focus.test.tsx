import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as Select from "../src/index.parts";

function OpenOnFocusSelect({ openOnFocus = true }: { openOnFocus?: boolean }) {
  return (
    <Select.Root openOnFocus={openOnFocus}>
      <Select.Trigger data-testid="trigger">
        <Select.Value placeholder="Pick…" />
      </Select.Trigger>
      <Select.Content data-testid="content">
        <Select.List>
          <Select.Item value="a">
            <Select.ItemText>Alpha</Select.ItemText>
          </Select.Item>
          <Select.Item value="b">
            <Select.ItemText>Beta</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Content>
    </Select.Root>
  );
}

describe("openOnFocus", () => {
  it("opens the listbox when the trigger receives focus", async () => {
    const user = userEvent.setup();
    render(<OpenOnFocusSelect />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.tab();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open on focus when openOnFocus is false", async () => {
    const user = userEvent.setup();
    render(<OpenOnFocusSelect openOnFocus={false} />);

    const trigger = screen.getByRole("combobox");
    await user.tab();

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("allows Trigger-level openOnFocus override", async () => {
    const user = userEvent.setup();
    render(
      <Select.Root openOnFocus={false}>
        <Select.Trigger data-testid="trigger" openOnFocus>
          <Select.Value placeholder="Pick…" />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            <Select.Item value="a">
              <Select.ItemText>Alpha</Select.ItemText>
            </Select.Item>
          </Select.List>
        </Select.Content>
      </Select.Root>,
    );

    const trigger = screen.getByRole("combobox");
    await user.tab();

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});