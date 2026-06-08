import React, { useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as Select from "../src/index.parts";

// ── Shared fixtures (Tier 2: portal + container) ──────────────────────────────

function InlineSelect({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <div data-testid="inline-parent">
      <Select.Root defaultOpen={defaultOpen}>
        <Select.Trigger data-testid="trigger">
          <Select.Value placeholder="Choose…" />
        </Select.Trigger>
        <Select.Content data-testid="content">
          <Select.List>
            <Select.Item value="a">
              <Select.ItemText>Alpha</Select.ItemText>
            </Select.Item>
          </Select.List>
        </Select.Content>
      </Select.Root>
    </div>
  );
}

function PortalSelect({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <div data-testid="inline-parent">
      <Select.Root defaultOpen={defaultOpen}>
        <Select.Trigger data-testid="trigger">
          <Select.Value placeholder="Choose…" />
        </Select.Trigger>
        <Select.Content portal data-testid="content">
          <Select.List>
            <Select.Item value="a">
              <Select.ItemText>Alpha</Select.ItemText>
            </Select.Item>
          </Select.List>
        </Select.Content>
      </Select.Root>
    </div>
  );
}

function ContainerPortalSelect({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div data-testid="inline-parent">
        <Select.Root defaultOpen={defaultOpen}>
          <Select.Trigger data-testid="trigger">
            <Select.Value placeholder="Choose…" />
          </Select.Trigger>
          <Select.Content portal container={containerRef} data-testid="content">
            <Select.List>
              <Select.Item value="a">
                <Select.ItemText>Alpha</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Content>
        </Select.Root>
      </div>
      <div ref={containerRef} data-testid="portal-container" />
    </>
  );
}

// ── portal + container ────────────────────────────────────────────────────────

describe("portal", () => {
  it("renders content inline by default (portal=false)", async () => {
    const user = userEvent.setup();
    render(<InlineSelect />);

    await user.click(screen.getByTestId("trigger"));

    const parent = screen.getByTestId("inline-parent");
    const content = screen.getByTestId("content");
    expect(parent.contains(content)).toBe(true);
  });

  it("portals content to document.body when portal=true", async () => {
    const user = userEvent.setup();
    render(<PortalSelect />);

    await user.click(screen.getByTestId("trigger"));

    const content = screen.getByTestId("content");
    const parent = screen.getByTestId("inline-parent");
    expect(parent.contains(content)).toBe(false);
    expect(document.body.contains(content)).toBe(true);
  });

  it("portals content into a custom container when container is provided", async () => {
    const user = userEvent.setup();
    render(<ContainerPortalSelect />);

    await user.click(screen.getByTestId("trigger"));

    const content = screen.getByTestId("content");
    const container = screen.getByTestId("portal-container");
    const parent = screen.getByTestId("inline-parent");

    expect(parent.contains(content)).toBe(false);
    expect(container.contains(content)).toBe(true);
  });

  it("custom container takes precedence over document.body", async () => {
    const user = userEvent.setup();
    render(<ContainerPortalSelect defaultOpen />);

    const content = screen.getByTestId("content");
    const container = screen.getByTestId("portal-container");

    expect(container.contains(content)).toBe(true);
    expect(content.parentElement).not.toBe(document.body);
  });
});