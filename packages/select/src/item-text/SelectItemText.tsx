import React from "react";

export type ItemTextProps = React.HTMLAttributes<HTMLSpanElement>;

/** Text label for a Select.Item — also used by Select.Value to display the selected label. */
export function ItemText({ children, ...props }: ItemTextProps) {
  return <span {...props}>{children}</span>;
}
