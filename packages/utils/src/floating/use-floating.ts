import {
  useFloating as useFloatingUi,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
} from "@floating-ui/react-dom";
import type { Placement } from "@floating-ui/react-dom";
import type { CSSProperties } from "react";

export type FloatingSide = "top" | "bottom" | "left" | "right";
export type FloatingAlign = "start" | "center" | "end";

export interface UseFloatingOptions {
  referenceElement?: HTMLElement | null;
  open: boolean;
  side?: FloatingSide | undefined;
  align?: FloatingAlign | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  sameWidth?: boolean | undefined;
}

export interface UseFloatingReturn {
  setReference: (node: HTMLElement | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  isPositioned: boolean;
}

function toPlacement(side: FloatingSide, align: FloatingAlign): Placement {
  return (align === "center" ? side : `${side}-${align}`) as Placement;
}

export function useFloating({
  referenceElement,
  open,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
  sameWidth = false,
}: UseFloatingOptions): UseFloatingReturn {
  const { refs, floatingStyles, isPositioned } = useFloatingUi({
    placement: toPlacement(side, align),
    strategy: "fixed",
    open,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      ...(avoidCollisions ? [flip(), shift({ padding: collisionPadding })] : []),
      ...(sameWidth
        ? [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
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