import { renderHook } from "@testing-library/react";
import { POPUP_POLICY_DEFAULTS } from "../src/popup-policy";
import { usePresence } from "../src/presence/use-presence";
import { useEscapeKey } from "../src/dismiss/use-escape-key";

describe("POPUP_POLICY_DEFAULTS", () => {
  it("matches docs/popup-policy.md contract", () => {
    expect(POPUP_POLICY_DEFAULTS).toEqual({
      modal: false,
      portal: false,
      lazyMount: true,
      unmountOnExit: false,
      escapeStopPropagation: true,
    });
  });
});

describe("utils hooks honor popup-policy defaults", () => {
  it("usePresence: lazyMount=true, unmountOnExit=false by default", () => {
    const { result } = renderHook(() => usePresence({ open: false }));
    expect(result.current.present).toBe(false);

    const { result: afterOpen } = renderHook(() => usePresence({ open: true }));
    expect(afterOpen.current.present).toBe(true);
  });

  it("useEscapeKey: stopPropagation=true by default", () => {
    const onEscape = vi.fn();
    const parentEscape = vi.fn();

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") parentEscape();
    });

    renderHook(() => useEscapeKey({ enabled: true, onEscape }));

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    vi.spyOn(event, "stopPropagation");

    document.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(parentEscape).not.toHaveBeenCalled();
  });
});