import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as Select from "../src/index.parts";

const ITEMS = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
} as const;

// ── Shared fixture (Tier 2: items prop) ───────────────────────────────────────

function ItemsPropSelect({
  defaultValue,
  defaultOpen = false,
}: {
  defaultValue?: string;
  defaultOpen?: boolean;
}) {
  return (
    <Select.Root
      name="framework"
      items={ITEMS}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
    >
      <Select.Label>Framework</Select.Label>
      <Select.Trigger data-testid="trigger">
        <Select.Value placeholder="Choose…" />
      </Select.Trigger>
      <Select.Content data-testid="content">
        <Select.List>
          {/* Only vue + svelte rendered — react label comes from items prop */}
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

// ── items prop label resolution ───────────────────────────────────────────────

describe("items prop", () => {
  it("resolves label from items map when Item is not mounted", () => {
    render(<ItemsPropSelect defaultValue="react" />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("React");
  });

  it("prefers registered Item label over items map when both exist", () => {
    render(<ItemsPropSelect defaultValue="vue" />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("Vue");
  });

  it("falls back to raw value when neither items map nor registry has a label", () => {
    render(<ItemsPropSelect defaultValue="angular" />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("angular");
  });

  it("hidden select option labels use items map for unmounted values", () => {
    render(<ItemsPropSelect defaultValue="react" />);
    const hidden = document.querySelector('select[name="framework"]') as HTMLSelectElement;
    const reactOption = Array.from(hidden.options).find((o) => o.value === "react");
    expect(reactOption).toBeDefined();
    expect(reactOption?.textContent).toBe("React");
  });

  it("items map labels are available before list items mount", () => {
    render(
      <Select.Root name="fw" items={ITEMS} defaultValue="svelte">
        <Select.Trigger data-testid="trigger">
          <Select.Value placeholder="…" />
        </Select.Trigger>
        <Select.HiddenSelect />
      </Select.Root>,
    );
    expect(screen.getByTestId("trigger")).toHaveTextContent("Svelte");
  });
});