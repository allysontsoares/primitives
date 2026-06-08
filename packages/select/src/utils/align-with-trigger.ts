import type { FloatingSide } from "@kenos-ui/utils";

export function getAlignItemWithTriggerOffset(
  alignItemWithTrigger: boolean,
  side: FloatingSide,
  triggerHeight: number,
  sideOffset: number,
): number {
  if (!alignItemWithTrigger || triggerHeight <= 0) {
    return sideOffset;
  }

  if (side === "bottom" || side === "top") {
    return -triggerHeight + sideOffset;
  }

  return sideOffset;
}

export function shouldDisableFlipForAlign(alignItemWithTrigger: boolean): boolean {
  return alignItemWithTrigger;
}