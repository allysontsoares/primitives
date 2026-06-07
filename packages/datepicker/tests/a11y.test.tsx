import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import * as DatePicker from "../src/date-picker/index";

function OpenPicker() {
  return (
    <DatePicker.Root defaultValue={new Date(2024, 5, 15)} defaultOpen>
      <DatePicker.Label>Event date</DatePicker.Label>
      <DatePicker.Input />
      <DatePicker.Trigger>Open calendar</DatePicker.Trigger>
      <DatePicker.Content forceMount>
        <DatePicker.ViewControl>
          <DatePicker.PrevTrigger />
          <DatePicker.ViewTrigger />
          <DatePicker.NextTrigger />
        </DatePicker.ViewControl>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

describe("DatePicker accessibility (axe)", () => {
  it("DatePicker.Root has no axe violations when open", async () => {
    const { container } = render(<OpenPicker />);
    // color-contrast needs canvas; skip in jsdom — structural a11y is still checked
    const results = await axe(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});