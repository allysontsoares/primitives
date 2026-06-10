import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as DatePicker from "../src/date-picker/index";

describe("range resize", () => {
  it("clicking range end re-anchors selection", async () => {
    render(
      <DatePicker.Root
        mode="range"
        defaultOpen
        closeOnSelect={false}
        defaultValue={{ start: new Date(2024, 5, 10), end: new Date(2024, 5, 20) }}
      >
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );

    const day20 = screen
      .getAllByRole("gridcell")
      .find((c) => c.textContent?.trim() === "20" && !c.hasAttribute("data-outside-month"));
    fireEvent.click(day20!);

    expect(document.querySelector('[data-range-end="true"]')).toBeNull();
    expect(document.querySelector('[data-range-start="true"]')?.textContent?.trim()).toBe("20");
  });
});
