import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as Select from "../src/index.parts";

// ── Shared fixture ────────────────────────────────────────────────────────────

function BasicSelect({
  defaultOpen = false,
  defaultValue,
}: {
  defaultOpen?: boolean;
  defaultValue?: string;
}) {
  return (
    <Select.Root name="framework" defaultOpen={defaultOpen} defaultValue={defaultValue}>
      <Select.Label>Framework</Select.Label>
      <Select.Trigger>
        <Select.Value placeholder="Choose…" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content forceMount data-testid="content">
        <Select.List data-testid="list">
          <Select.Item value="react">
            <Select.ItemText>React</Select.ItemText>
            <Select.ItemIndicator value="react">✓</Select.ItemIndicator>
          </Select.Item>
          <Select.Item value="vue">
            <Select.ItemText>Vue</Select.ItemText>
            <Select.ItemIndicator value="vue">✓</Select.ItemIndicator>
          </Select.Item>
          <Select.Item value="svelte" disabled>
            <Select.ItemText>Svelte</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Content>
      <Select.HiddenSelect />
    </Select.Root>
  );
}

// ── Label ─────────────────────────────────────────────────────────────────────

describe("Label", () => {
  it("renders a <label> element", () => {
    render(<BasicSelect />);
    const label = screen.getByText("Framework");
    expect(label.tagName).toBe("LABEL");
  });

  it("htmlFor matches the trigger id", () => {
    render(<BasicSelect />);
    const label = screen.getByText("Framework") as HTMLLabelElement;
    const trigger = screen.getByRole("combobox");
    expect(label.htmlFor).toBe(trigger.id);
  });
});

// ── Trigger ───────────────────────────────────────────────────────────────────

describe("Trigger", () => {
  it('has role="combobox"', () => {
    render(<BasicSelect />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it('has aria-haspopup="listbox"', () => {
    render(<BasicSelect />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("reflects aria-expanded=false when closed", () => {
    render(<BasicSelect defaultOpen={false} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("reflects aria-expanded=true when open", () => {
    render(<BasicSelect defaultOpen />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  it("aria-controls is absent when closed", () => {
    render(<BasicSelect defaultOpen={false} />);
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-controls");
  });

  it("aria-controls matches content id when open", () => {
    render(<BasicSelect defaultOpen />);
    const trigger = screen.getByRole("combobox");
    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    expect(document.getElementById(contentId!)).toBeInTheDocument();
  });
});

// ── Content / Listbox ─────────────────────────────────────────────────────────

describe("Content + List", () => {
  it('list has role="listbox"', () => {
    render(<BasicSelect defaultOpen />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("listbox is associated with the label via aria-labelledby", () => {
    render(<BasicSelect defaultOpen />);
    const listbox = screen.getByRole("listbox");
    const labelledById = listbox.getAttribute("aria-labelledby");
    expect(labelledById).toBeTruthy();
    expect(document.getElementById(labelledById!)).toHaveTextContent("Framework");
  });
});

// ── Items ─────────────────────────────────────────────────────────────────────

describe("Item", () => {
  it('each item has role="option"', () => {
    render(<BasicSelect defaultOpen />);
    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThanOrEqual(3);
  });

  it("aria-selected=false on unselected item", () => {
    render(<BasicSelect defaultOpen />);
    const reactOpt = screen.getByRole("option", { name: /react/i });
    expect(reactOpt).toHaveAttribute("aria-selected", "false");
  });

  it("aria-selected=true on selected item (defaultValue)", () => {
    render(<BasicSelect defaultOpen defaultValue="react" />);
    const reactOpt = screen.getByRole("option", { name: /react/i });
    expect(reactOpt).toHaveAttribute("aria-selected", "true");
  });

  it("data-selected is set on selected item", () => {
    render(<BasicSelect defaultOpen defaultValue="vue" />);
    const vueOpt = screen.getByRole("option", { name: /vue/i });
    expect(vueOpt).toHaveAttribute("data-selected", "true");
  });

  it("disabled item has aria-disabled", () => {
    render(<BasicSelect defaultOpen />);
    const svelte = screen.getByRole("option", { name: /svelte/i });
    expect(svelte).toHaveAttribute("aria-disabled", "true");
    expect(svelte).toHaveAttribute("data-disabled", "true");
  });
});

// ── Value ─────────────────────────────────────────────────────────────────────

describe("Value", () => {
  it("shows placeholder when no value selected", () => {
    render(<BasicSelect />);
    expect(screen.getByText("Choose…")).toBeInTheDocument();
  });

  it("shows selected label when a value is set", () => {
    render(<BasicSelect defaultValue="react" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});

// ── HiddenSelect ──────────────────────────────────────────────────────────────

describe("HiddenSelect", () => {
  it("renders a hidden native select with name", () => {
    render(<BasicSelect />);
    const hidden = document.querySelector('select[name="framework"]') as HTMLSelectElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute("aria-hidden", "true");
  });

  it("reflects selected value", () => {
    render(<BasicSelect defaultValue="vue" />);
    const hidden = document.querySelector('select[name="framework"]') as HTMLSelectElement;
    expect(hidden.value).toBe("vue");
  });
});
