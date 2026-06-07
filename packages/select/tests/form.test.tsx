import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Select from "../src/index.parts";

// ── Shared fixture ────────────────────────────────────────────────────────────

function CountrySelect({
  name = "country",
  required = false,
  disabled = false,
  value,
  defaultValue,
  onValueChange,
}: {
  name?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (v: string | null) => void;
}) {
  return (
    <Select.Root
      name={name}
      required={required}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <Select.Trigger data-testid="trigger">
        <Select.Value placeholder="Country…" />
      </Select.Trigger>
      <Select.Content data-testid="content" forceMount>
        <Select.List>
          <Select.Item value="pt">
            <Select.ItemText>Portugal</Select.ItemText>
          </Select.Item>
          <Select.Item value="br">
            <Select.ItemText>Brazil</Select.ItemText>
          </Select.Item>
          <Select.Item value="us">
            <Select.ItemText>United States</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Content>
      <Select.HiddenSelect />
    </Select.Root>
  );
}

// ── Native form submission ────────────────────────────────────────────────────

describe("HiddenSelect — native form submission", () => {
  it("hidden select has the correct name attribute", () => {
    render(<CountrySelect name="country" />);
    const hidden = document.querySelector('select[name="country"]') as HTMLSelectElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute("name", "country");
  });

  it("hidden select reflects defaultValue after items mount", () => {
    render(<CountrySelect defaultValue="pt" />);
    const hidden = document.querySelector('select[name="country"]') as HTMLSelectElement;
    expect(hidden.value).toBe("pt");
  });

  it("hidden select value updates when user selects an item", async () => {
    const user = userEvent.setup();
    render(<CountrySelect />);

    await user.click(screen.getByTestId("trigger"));
    const brOption = screen.getByRole("option", { name: /brazil/i });
    await user.click(brOption);

    const hidden = document.querySelector('select[name="country"]') as HTMLSelectElement;
    expect(hidden.value).toBe("br");
  });

  it("required attribute is forwarded to hidden select", () => {
    render(<CountrySelect required />);
    const hidden = document.querySelector('select[name="country"]') as HTMLSelectElement;
    expect(hidden).toHaveAttribute("required");
  });

  it("disabled attribute is forwarded to hidden select", () => {
    render(<CountrySelect disabled />);
    const hidden = document.querySelector('select[name="country"]') as HTMLSelectElement;
    expect(hidden).toBeDisabled();
  });

  it("is included in FormData on submit", () => {
    let capturedData: FormData | null = null;
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      capturedData = new FormData(e.currentTarget);
    });

    render(
      <form onSubmit={onSubmit}>
        <CountrySelect defaultValue="pt" />
        <button type="submit">Submit</button>
      </form>,
    );

    fireEvent.submit(screen.getByRole("button", { name: /submit/i }).closest("form")!);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(capturedData!.get("country")).toBe("pt");
  });
});

// ── React Hook Form smoke ─────────────────────────────────────────────────────

/**
 * RHF smoke: we simulate a Controller-style binding manually
 * (no need to install RHF as a test dependency — the pattern
 *  is what matters: controlled value + onValueChange = onChange).
 */
describe("React Hook Form Controller smoke", () => {
  it("controlled value + onValueChange works like a RHF Controller", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function RHFLikeSelect() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <CountrySelect
          value={value}
          onValueChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
      );
    }

    render(<RHFLikeSelect />);

    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByRole("option", { name: /portugal/i }));

    expect(onChange).toHaveBeenCalledWith("pt");
    expect((document.querySelector('select[name="country"]') as HTMLSelectElement).value).toBe(
      "pt",
    );
  });
});

// ── TanStack Form smoke ───────────────────────────────────────────────────────

/**
 * TanStack Form smoke: same controlled pattern.
 */
describe("TanStack Form field smoke", () => {
  it("controlled select with field.value + field.onChange", async () => {
    const user = userEvent.setup();
    const fieldOnChange = vi.fn();

    function TanStackLikeSelect() {
      const [fieldValue, setFieldValue] = useState<string | null>(null);
      return (
        <CountrySelect
          value={fieldValue}
          onValueChange={(v) => {
            setFieldValue(v);
            fieldOnChange(v);
          }}
        />
      );
    }

    render(<TanStackLikeSelect />);

    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByRole("option", { name: /united states/i }));

    expect(fieldOnChange).toHaveBeenCalledWith("us");
  });
});
