import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Select from "../src/index.parts";

function PresenceSelect({
  defaultOpen = false,
  lazyMount = true,
  unmountOnExit = false,
  forceMount,
  onOpenChangeComplete,
}: {
  defaultOpen?: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  forceMount?: boolean;
  onOpenChangeComplete?: (open: boolean) => void;
}) {
  return (
    <Select.Root defaultOpen={defaultOpen}>
      <Select.Trigger>
        <Select.Value placeholder="Choose…" />
      </Select.Trigger>
      <Select.Content
        data-testid="content"
        lazyMount={lazyMount}
        unmountOnExit={unmountOnExit}
        forceMount={forceMount}
        onOpenChangeComplete={onOpenChangeComplete}
      >
        <Select.List>
          <Select.Item value="react">
            <Select.ItemText>React</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Content>
    </Select.Root>
  );
}

describe("presence (lazyMount / unmountOnExit)", () => {
  it("lazyMount: does not mount content until first open", () => {
    render(<PresenceSelect />);
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("lazyMount: mounts content after trigger opens", async () => {
    const user = userEvent.setup();
    render(<PresenceSelect />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("lazyMount=false: content is in the DOM while closed", () => {
    render(<PresenceSelect lazyMount={false} />);
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toHaveAttribute("data-state", "closed");
  });

  it("unmountOnExit=false: keeps content mounted after close", async () => {
    const user = userEvent.setup();
    render(<PresenceSelect defaultOpen />);
    expect(screen.getByTestId("content")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toHaveAttribute("data-state", "closed");
  });

  it("unmountOnExit=true: removes content from DOM after close", async () => {
    const user = userEvent.setup();
    render(<PresenceSelect defaultOpen unmountOnExit />);
    expect(screen.getByTestId("content")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });
  });

  it("forceMount: always keeps content in the DOM", () => {
    render(<PresenceSelect forceMount />);
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("calls onOpenChangeComplete when open state settles", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<PresenceSelect onOpenChangeComplete={onComplete} />);

    await user.click(screen.getByRole("combobox"));
    expect(onComplete).toHaveBeenCalledWith(true);

    await user.keyboard("{Escape}");
    expect(onComplete).toHaveBeenCalledWith(false);
  });
});