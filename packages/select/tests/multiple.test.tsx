import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Select from "../src/index.parts";

// ── Shared fixture (Tier 2: multiple) ─────────────────────────────────────────

function MultipleSelect({
  defaultOpen = false,
  defaultValue = [] as string[],
  onValueChange,
}: {
  defaultOpen?: boolean;
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}) {
  return (
    <Select.Root
      name="tags"
      multiple
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <Select.Label>Tags</Select.Label>
      <Select.Trigger data-testid="trigger">
        <Select.Value placeholder="Pick tags…" />
      </Select.Trigger>
      <Select.Content data-testid="content">
        <Select.List>
          <Select.Item value="react">
            <Select.ItemText>React</Select.ItemText>
          </Select.Item>
          <Select.Item value="vue">
            <Select.ItemText>Vue</Select.ItemText>
          </Select.Item>
          <Select.Item value="svelte">
            <Select.ItemText>Svelte</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Content>
      <Select.HiddenSelect />
    </Select.Root>
  );
}

// ── Multiple selection ────────────────────────────────────────────────────────

describe("multiple mode", () => {
  it('listbox has aria-multiselectable="true"', () => {
    render(<MultipleSelect defaultOpen />);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("selecting an item adds it to the value array", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<MultipleSelect defaultOpen onValueChange={onValueChange} />);

    await user.click(screen.getByRole("option", { name: /react/i }));
    expect(onValueChange).toHaveBeenCalledWith(["react"]);
  });

  it("selecting a second item appends to the value array", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <MultipleSelect defaultOpen defaultValue={["react"]} onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("option", { name: /vue/i }));
    expect(onValueChange).toHaveBeenCalledWith(["react", "vue"]);
  });

  it("clicking a selected item toggles it off", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <MultipleSelect defaultOpen defaultValue={["react", "vue"]} onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("option", { name: /react/i }));
    expect(onValueChange).toHaveBeenCalledWith(["vue"]);
  });

  it("keeps the listbox open after selecting an item", async () => {
    const user = userEvent.setup();
    render(<MultipleSelect defaultOpen />);

    await user.click(screen.getByRole("option", { name: /react/i }));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  it("marks multiple options as aria-selected", () => {
    render(<MultipleSelect defaultOpen defaultValue={["react", "vue"]} />);

    expect(screen.getByRole("option", { name: /react/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("option", { name: /vue/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: /svelte/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("displays selected labels in the trigger value", () => {
    render(<MultipleSelect defaultValue={["react", "vue"]} />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("React");
    expect(screen.getByTestId("trigger")).toHaveTextContent("Vue");
  });
});