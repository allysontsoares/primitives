import { renderHook } from "@testing-library/react";
import { useClickOutside } from "../src/dismiss/use-click-outside";

describe("useClickOutside (popup-policy dismiss)", () => {
  it("calls handler on pointerdown outside all refs", () => {
    const handler = vi.fn();
    const inside = document.createElement("div");
    const outside = document.createElement("div");
    document.body.append(inside, outside);

    const insideRef = { current: inside };

    renderHook(() => useClickOutside([insideRef], handler, true));

    outside.dispatchEvent(
      new Event("pointerdown", { bubbles: true }) as PointerEvent,
    );
    expect(handler).toHaveBeenCalledTimes(1);

    inside.dispatchEvent(new Event("pointerdown", { bubbles: true }) as PointerEvent);
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(inside);
    document.body.removeChild(outside);
  });

  it("does not call handler when disabled", () => {
    const handler = vi.fn();
    const outside = document.createElement("div");
    document.body.append(outside);

    const ref = { current: null as HTMLDivElement | null };
    renderHook(() => useClickOutside([ref], handler, false));

    outside.dispatchEvent(
      new Event("pointerdown", { bubbles: true }) as PointerEvent,
    );
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outside);
  });
});