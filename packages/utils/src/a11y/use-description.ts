import { useId } from "react";

export function useDescription(description?: string) {
  const id = useId();
  if (!description) {
    return { id: undefined, descriptionProps: {} as { id?: string; "aria-describedby"?: string } };
  }
  return {
    id,
    descriptionProps: {
      id,
      "aria-describedby": id,
    },
  };
}
