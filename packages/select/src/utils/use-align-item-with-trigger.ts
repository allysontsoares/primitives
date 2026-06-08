import { useLayoutEffect, useState } from "react";
import type { FloatingSide } from "@kenos-ui/utils";
import type { SelectRefs } from "../context";
import {
  getAlignItemWithTriggerOffset,
  shouldDisableFlipForAlign,
} from "./align-with-trigger";

export interface AlignItemWithTriggerOptions {
  alignItemWithTrigger: boolean;
  side: FloatingSide;
  sideOffset: number;
  open: boolean;
  refs: SelectRefs;
}

export function useAlignItemWithTrigger({
  alignItemWithTrigger,
  side,
  sideOffset,
  open,
  refs,
}: AlignItemWithTriggerOptions) {
  const [triggerHeight, setTriggerHeight] = useState(0);

  useLayoutEffect(() => {
    if (!alignItemWithTrigger || !open) {
      setTriggerHeight(0);
      return;
    }

    const trigger = refs.triggerRef.current;
    if (!trigger) return;

    const update = () => setTriggerHeight(trigger.offsetHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(trigger);

    return () => observer.disconnect();
  }, [alignItemWithTrigger, open, refs.triggerRef]);

  const effectiveSideOffset = getAlignItemWithTriggerOffset(
    alignItemWithTrigger,
    side,
    triggerHeight,
    sideOffset,
  );

  const avoidCollisionsOverride = shouldDisableFlipForAlign(alignItemWithTrigger)
    ? false
    : undefined;

  return {
    alignItemWithTriggerActive: alignItemWithTrigger && triggerHeight > 0,
    effectiveSideOffset,
    avoidCollisionsOverride,
  };
}