import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as DatePicker from "../src/date-picker/index";

describe("HiddenInput", () => {
  it("renders hidden input with ISO-like value when name is set", () => {
    render(
      <DatePicker.Root name="birthdate" defaultValue={new Date(2024, 5, 15)}>
        <DatePicker.HiddenInput />
      </DatePicker.Root>,
    );
    const input = document.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(input.type).toBe("hidden");
    expect(input.name).toBe("birthdate");
    expect(input.value).toMatch(/2024/);
    expect(input.value).toMatch(/15/);
  });

  it("does not render when name is absent", () => {
    const { container } = render(
      <DatePicker.Root defaultValue={new Date(2024, 5, 15)}>
        <DatePicker.HiddenInput />
      </DatePicker.Root>,
    );
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it("sets required when Root has required", () => {
    render(
      <DatePicker.Root name="date" required defaultValue={new Date(2024, 5, 15)}>
        <DatePicker.HiddenInput />
      </DatePicker.Root>,
    );
    const input = document.querySelector('input[type="hidden"]')!;
    expect(input).toHaveAttribute("required");
  });
});
