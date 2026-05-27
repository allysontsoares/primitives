import React from 'react';

export type ViewControlProps = React.HTMLAttributes<HTMLDivElement>;

export function ViewControl({ children, ...props }: ViewControlProps) {
  return <div role="group" {...props}>{children}</div>;
}
