import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Select from "../src/index.parts";

function BasicSelect({
  defaultOpen = false,
  defaultValue,
  onValueChange,
}: {
  defaultOpen?: boolean;
  defaultValue?: string;
  onValueChange?: (v: string | null) => void;
}) {
  return (
    <Select.Root
      name="lang"
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <Select.Label>Language</Select.Label>
      <Select.Trigger data-testid="trigger">
        <Select.Value placeholder="Pick…" />
      </Select.Trigger>
      <Select.Content data-testid="content">
        <Select.List>
          <Select.Item value="ts">
            <Select.ItemText>TypeScript</Select.ItemText>
          </Select.Item>
          <Select.Item value="js">
            <Select.ItemText>JavaScript</Select.ItemText>
          </Select.Item>
          <Select.Item value="py" disabled>
            <Select.ItemText>Python (disabled)</Select.ItemText>
          </Select.Item>
          <Select.Item value="rs">
            <Select.ItemText>Rust</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Content>
    </Select.Root>
  );
}

// ── Open / close via click ────────────────────────────────────────────────────

describe("Open/close via click", () => {
  it("opens the listbox when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the listbox when trigger is clicked again", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

// ── Keyboard navigation ───────────────────────────────────────────────────────

describe("Keyboard navigation", () => {
  it("ArrowDown highlights the first item when nothing is highlighted", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    await user.type(content, "{ArrowDown}");
    const tsOption = screen.getByRole("option", { name: /typescript/i });
    expect(tsOption).toHaveAttribute("data-highlighted", "true");
  });

  it("ArrowDown moves highlight to next item", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{ArrowDown}");
    const jsOption = screen.getByRole("option", { name: /javascript/i });
    expect(jsOption).toHaveAttribute("data-highlighted", "true");
  });

  it("ArrowDown skips disabled items", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    // ts → js → (skip py) → rs
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{ArrowDown}");
    const rsOption = screen.getByRole("option", { name: /rust/i });
    expect(rsOption).toHaveAttribute("data-highlighted", "true");
  });

  it("ArrowUp moves highlight to previous item", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{ArrowUp}");
    const tsOption = screen.getByRole("option", { name: /typescript/i });
    expect(tsOption).toHaveAttribute("data-highlighted", "true");
  });

  it("Home highlights the first enabled item", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{Home}");
    const tsOption = screen.getByRole("option", { name: /typescript/i });
    expect(tsOption).toHaveAttribute("data-highlighted", "true");
  });

  it("End highlights the last enabled item", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    await user.type(content, "{End}");
    const rsOption = screen.getByRole("option", { name: /rust/i });
    expect(rsOption).toHaveAttribute("data-highlighted", "true");
  });

  it("Enter selects the highlighted item and closes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen onValueChange={onValueChange} />);
    const content = screen.getByTestId("content");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("ts");
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("Space selects the highlighted item and closes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen onValueChange={onValueChange} />);
    const content = screen.getByTestId("content");
    await user.type(content, "{ArrowDown}");
    await user.type(content, "{ }");
    expect(onValueChange).toHaveBeenCalledWith("ts");
  });

  it("Escape closes the listbox without selecting", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen onValueChange={onValueChange} />);
    await user.keyboard("{Escape}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });
});

// ── Typeahead ─────────────────────────────────────────────────────────────────

describe("Typeahead", () => {
  it("typing 'r' highlights the item starting with 'r'", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    await user.type(content, "r");
    const rsOption = screen.getByRole("option", { name: /rust/i });
    expect(rsOption).toHaveAttribute("data-highlighted", "true");
  });

  it("typing 'j' highlights JavaScript", async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen />);
    const content = screen.getByTestId("content");
    await user.type(content, "j");
    const jsOption = screen.getByRole("option", { name: /javascript/i });
    expect(jsOption).toHaveAttribute("data-highlighted", "true");
  });
});

// ── Click item to select ──────────────────────────────────────────────────────

describe("Click to select", () => {
  it("clicking an item selects it and closes the listbox", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen onValueChange={onValueChange} />);
    const jsOption = screen.getByRole("option", { name: /javascript/i });
    await user.click(jsOption);
    expect(onValueChange).toHaveBeenCalledWith("js");
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking a disabled item does not change value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<BasicSelect defaultOpen onValueChange={onValueChange} />);
    const pyOption = screen.getByRole("option", { name: /python/i });
    await user.click(pyOption);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
