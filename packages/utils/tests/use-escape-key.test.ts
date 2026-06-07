import { renderHook } from "@testing-library/react";
import { useEscapeKey } from "../src/dismiss/use-escape-key";

describe("useEscapeKey", () => {
  it("calls onEscape when Escape is pressed while enabled", () => {
    const onEscape = vi.fn();

    renderHook(() => useEscapeKey({ enabled: true, onEscape }));

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
    );

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("does not call onEscape when disabled", () => {
    const onEscape = vi.fn();

    renderHook(() => useEscapeKey({ enabled: false, onEscape }));

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
    );

    expect(onEscape).not.toHaveBeenCalled();
  });

  it("ignores non-Escape keys", () => {
    const onEscape = vi.fn();

    renderHook(() => useEscapeKey({ enabled: true, onEscape }));

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );

    expect(onEscape).not.toHaveBeenCalled();
  });

  it("stopPropagation=true (default): calls stopPropagation on Escape", () => {
    const onEscape = vi.fn();

    renderHook(() => useEscapeKey({ enabled: true, onEscape }));

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    const stopPropagation = vi.spyOn(event, "stopPropagation");

    document.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });

  it("stopPropagation=false: does not stop event propagation", () => {
    const onEscape = vi.fn();
    const parentEscape = vi.fn();

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") parentEscape();
    });

    renderHook(() =>
      useEscapeKey({ enabled: true, onEscape, stopPropagation: false }),
    );

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    const stopPropagation = vi.spyOn(event, "stopPropagation");

    document.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(stopPropagation).not.toHaveBeenCalled();
    expect(parentEscape).toHaveBeenCalledTimes(1);
  });
});