import React from "react";

export type IconProps = React.HTMLAttributes<HTMLSpanElement>;

/** Chevron/arrow slot — render your own icon as children. */
export function Icon({ children, ...props }: IconProps) {
  return (
    <span aria-hidden="true" {...props}>
      {children ?? "▾"}
    </span>
  );
}
