import { renderHook, act } from "@testing-library/react";
import { usePresence } from "../src/presence/use-presence";

describe("usePresence", () => {
  it("lazyMount: does not present until first open", () => {
    const { result, rerender } = renderHook(({ open }) => usePresence({ open, lazyMount: true }), {
      initialProps: { open: false },
    });

    expect(result.current.present).toBe(false);

    rerender({ open: true });
    expect(result.current.present).toBe(true);
  });

  it("lazyMount + unmountOnExit=false: keeps mounted after close", () => {
    const { result, rerender } = renderHook(
      ({ open }) => usePresence({ open, lazyMount: true, unmountOnExit: false }),
      { initialProps: { open: false } },
    );

    rerender({ open: true });
    expect(result.current.present).toBe(true);

    rerender({ open: false });
    expect(result.current.present).toBe(true);
  });

  it("lazyMount + unmountOnExit=true: unmounts when closed", () => {
    const { result, rerender } = renderHook(
      ({ open }) => usePresence({ open, lazyMount: true, unmountOnExit: true }),
      { initialProps: { open: false } },
    );

    rerender({ open: true });
    expect(result.current.present).toBe(true);

    rerender({ open: false });
    expect(result.current.present).toBe(false);
  });

  it("lazyMount=false: presents immediately even when closed", () => {
    const { result } = renderHook(() => usePresence({ open: false, lazyMount: false }));

    expect(result.current.present).toBe(true);
  });

  it("calls onOpenChangeComplete when open changes", () => {
    const onOpenChangeComplete = vi.fn();
    const { rerender } = renderHook(
      ({ open }) => usePresence({ open, onOpenChangeComplete }),
      { initialProps: { open: false } },
    );

    rerender({ open: true });
    expect(onOpenChangeComplete).toHaveBeenCalledWith(true);

    rerender({ open: false });
    expect(onOpenChangeComplete).toHaveBeenCalledWith(false);
  });

  it("re-opens after unmountOnExit unmount", () => {
    const { result, rerender } = renderHook(
      ({ open }) => usePresence({ open, lazyMount: true, unmountOnExit: true }),
      { initialProps: { open: true } },
    );

    rerender({ open: false });
    expect(result.current.present).toBe(false);

    act(() => {
      rerender({ open: true });
    });
    expect(result.current.present).toBe(true);
  });
});