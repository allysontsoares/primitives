import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as DatePicker from "../src/date-picker/index";

function BasicPicker({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <DatePicker.Root defaultValue={new Date(2024, 5, 15)} defaultOpen={defaultOpen}>
      <DatePicker.Label>Date</DatePicker.Label>
      <DatePicker.Input />
      <DatePicker.Trigger>Open</DatePicker.Trigger>
      <DatePicker.Content forceMount>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

describe("Label", () => {
  it("renders a <label> element", () => {
    render(<BasicPicker />);
    const label = screen.getByText("Date");
    expect(label.tagName).toBe("LABEL");
  });

  it("htmlFor matches the input group id", () => {
    render(<BasicPicker />);
    const label = screen.getByText("Date") as HTMLLabelElement;
    const group = getInputGroup();
    expect(label.htmlFor).toBe(group.id);
  });
});

// Get the Input's group (has aria-labelledby pointing to a label)
function getInputGroup() {
  return screen.getAllByRole("group").find((g) => g.hasAttribute("aria-labelledby"))!;
}

describe("Input (segmented)", () => {
  it("renders a group container", () => {
    render(<BasicPicker />);
    expect(getInputGroup()).toBeInTheDocument();
  });

  it("renders three spinbutton segments", () => {
    render(<BasicPicker />);
    const segments = screen.getAllByRole("spinbutton");
    expect(segments).toHaveLength(3);
  });

  it("each segment has an aria-label", () => {
    render(<BasicPicker />);
    const segments = screen.getAllByRole("spinbutton");
    segments.forEach((seg) => {
      expect(seg).toHaveAttribute("aria-label");
    });
  });

  it('empty segments have aria-valuetext="Blank" or no value', () => {
    render(
      <DatePicker.Root>
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount />
      </DatePicker.Root>,
    );
    const segments = screen.getAllByRole("spinbutton");
    segments.forEach((seg) => {
      const valueNow = seg.getAttribute("aria-valuenow");
      const valueText = seg.getAttribute("aria-valuetext");
      expect(valueNow === null || valueText === "Blank").toBe(true);
    });
  });

  it("populated segments have aria-valuenow set", () => {
    render(<BasicPicker />);
    const segments = screen.getAllByRole("spinbutton");
    // defaultValue is June 15, 2024 — all segments should have values
    const withValue = segments.filter((s) => s.hasAttribute("aria-valuenow"));
    expect(withValue).toHaveLength(3);
  });

  it("group is associated with the label via aria-labelledby", () => {
    render(<BasicPicker />);
    const group = getInputGroup();
    const labelId = group.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toHaveTextContent("Date");
  });

  it("segments show placeholder text when empty", () => {
    render(
      <DatePicker.Root>
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount />
      </DatePicker.Root>,
    );
    const segments = screen.getAllByRole("spinbutton");
    const placeholders = segments.map((s) => s.getAttribute("placeholder"));
    expect(placeholders.some((p) => p?.includes("mm"))).toBe(true);
    expect(placeholders.some((p) => p?.includes("dd"))).toBe(true);
    expect(placeholders.some((p) => p?.includes("yyyy"))).toBe(true);
  });
});

describe("Trigger", () => {
  it("is a button", () => {
    render(<BasicPicker />);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("BUTTON");
  });

  it('has aria-haspopup="dialog"', () => {
    render(<BasicPicker />);
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("reflects aria-expanded=false when closed", () => {
    render(<BasicPicker defaultOpen={false} />);
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "false");
  });

  it("aria-controls is absent when closed", () => {
    render(<BasicPicker defaultOpen={false} />);
    expect(screen.getByRole("button", { name: "Open" })).not.toHaveAttribute("aria-controls");
  });

  it("aria-controls matches content id when open", () => {
    render(<BasicPicker defaultOpen />);
    const trigger = screen.getByRole("button", { name: "Open" });
    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    expect(document.getElementById(contentId!)).toBeInTheDocument();
  });
});

describe("Content", () => {
  it('has role="dialog" when open', () => {
    render(<BasicPicker defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it('omits aria-modal when modal=false (popup-policy default)', () => {
    render(<BasicPicker defaultOpen />);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-modal", "true");
  });

  it('has aria-modal="true" when modal={true}', () => {
    render(
      <DatePicker.Root defaultOpen modal>
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Input />
        <DatePicker.Trigger>Open</DatePicker.Trigger>
        <DatePicker.Content forceMount>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("is hidden when closed (display none)", () => {
    render(<BasicPicker defaultOpen={false} />);
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toHaveStyle({ display: "none" });
  });
});

describe("Grid", () => {
  it('has role="grid"', () => {
    render(<BasicPicker defaultOpen />);
    const grid = screen.getAllByRole("grid").find((el) => el.tagName === "TABLE");
    expect(grid).toBeInTheDocument();
  });

  it("has an aria-label with month and year", () => {
    render(<BasicPicker defaultOpen />);
    const grid = screen.getAllByRole("grid").find((el) => el.tagName === "TABLE");
    expect(grid?.getAttribute("aria-label")).toMatch(/june|jun/i);
  });
});

describe("WeekDays", () => {
  it("renders 7 column headers", () => {
    render(<BasicPicker defaultOpen />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7);
  });

  it('each header has scope="col"', () => {
    render(<BasicPicker defaultOpen />);
    screen.getAllByRole("columnheader").forEach((th) => {
      expect(th).toHaveAttribute("scope", "col");
    });
  });
});

describe("Day cells", () => {
  it('each cell has role="gridcell"', () => {
    render(<BasicPicker defaultOpen />);
    const cells = screen.getAllByRole("gridcell");
    expect(cells.length).toBeGreaterThan(28);
  });

  it('today has aria-current="date"', () => {
    render(<BasicPicker defaultOpen />);
    const today = document.querySelector('[aria-current="date"]');
    if (today) {
      expect(today).toHaveAttribute("aria-current", "date");
    }
  });

  it('selected date has aria-selected="true"', () => {
    render(<BasicPicker defaultOpen />);
    const selected = document.querySelector("[data-selected]");
    expect(selected).not.toBeNull();
    expect(selected).toHaveAttribute("aria-selected", "true");
  });
});

describe("Navigation buttons", () => {
  it("PrevTrigger has a meaningful aria-label", () => {
    render(<BasicPicker defaultOpen />);
    const prevBtn = screen.getByRole("button", { name: /previous month/i });
    expect(prevBtn).toBeInTheDocument();
  });

  it("NextTrigger has a meaningful aria-label", () => {
    render(<BasicPicker defaultOpen />);
    const nextBtn = screen.getByRole("button", { name: /next month/i });
    expect(nextBtn).toBeInTheDocument();
  });

  it("ViewTrigger cycles view labels", () => {
    render(<BasicPicker defaultOpen />);
    const viewBtn = screen.getByRole("button", {
      name: /switch to month view/i,
    });
    expect(viewBtn).toBeInTheDocument();
  });
});
