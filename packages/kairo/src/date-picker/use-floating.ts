import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/react-dom";
import type { Placement } from "@floating-ui/react-dom";
import type { CSSProperties } from "react";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

export interface FloatingOptions {
  referenceElement?: HTMLElement | null;
  open: boolean;
  side?: Side | undefined;
  align?: Align | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
}

function toPlacement(side: Side, align: Align): Placement {
  return (align === "center" ? side : `${side}-${align}`) as Placement;
}

export function useDatePickerFloating({
  referenceElement,
  open,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
}: FloatingOptions): {
  setReference: (node: HTMLElement | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  isPositioned: boolean;
} {
  const { refs, floatingStyles, isPositioned } = useFloating({
    placement: toPlacement(side, align),
    strategy: "fixed",
    open,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      ...(avoidCollisions ? [flip(), shift({ padding: collisionPadding })] : []),
    ],
    ...(referenceElement !== undefined ? { elements: { reference: referenceElement } } : {}),
  });

  return {
    setReference: refs.setReference,
    setFloating: refs.setFloating,
    floatingStyles,
    isPositioned,
  };
}
