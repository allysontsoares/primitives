import React from "react";
import { ScrollButton } from "../scroll-button/SelectScrollButton";
import type { SelectScrollButtonProps } from "../types";

export type ScrollUpButtonProps = Omit<SelectScrollButtonProps, "direction">;

export function ScrollUpButton(props: ScrollUpButtonProps) {
  return <ScrollButton direction="up" {...props} />;
}