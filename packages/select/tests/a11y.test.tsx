import React from "react";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import * as Select from "../src/index.parts";

function OpenSelect() {
  return (
    <Select.Root name="framework" defaultOpen defaultValue="react">
      <Select.Label>Framework</Select.Label>
      <Select.Trigger>
        <Select.Value placeholder="Choose…" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content forceMount>
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

describe("Select accessibility (axe)", () => {
  it("Select.Root has no axe violations when open", async () => {
    const { container } = render(<OpenSelect />);
    const results = await axe(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});