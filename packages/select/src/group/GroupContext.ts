import { createContext, useContext } from "react";

export interface GroupContextValue {
  labelId: string;
}

export const GroupContext = createContext<GroupContextValue | null>(null);

export function useGroupContext(): GroupContextValue | null {
  return useContext(GroupContext);
}
