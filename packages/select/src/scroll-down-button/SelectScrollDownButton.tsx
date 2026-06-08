import React from "react";
import { ScrollButton } from "../scroll-button/SelectScrollButton";
import type { SelectScrollButtonProps } from "../types";

export type ScrollDownButtonProps = Omit<SelectScrollButtonProps, "direction">;

export function ScrollDownButton(props: ScrollDownButtonProps) {
  return <ScrollButton direction="down" {...props} />;
}