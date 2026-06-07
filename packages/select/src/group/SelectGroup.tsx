import React, { useId } from "react";
import { GroupContext } from "./GroupContext";

export type GroupProps = React.HTMLAttributes<HTMLDivElement>;

export function Group({ children, ...props }: GroupProps) {
  const groupId = useId();
  const labelId = `${groupId}-label`;

  return (
    <GroupContext.Provider value={{ labelId }}>
      <div role="group" aria-labelledby={labelId} {...props}>
        {children}
      </div>
    </GroupContext.Provider>
  );
}
