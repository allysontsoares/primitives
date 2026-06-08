import React, { createContext, useContext } from "react";
import { createPortal } from "react-dom";
import type { SelectPortalContainer, SelectPortalProps } from "../types";

export const PortalContext = createContext(false);

export function usePortalContext(): boolean {
  return useContext(PortalContext);
}

export function resolvePortalContainer(
  container: SelectPortalContainer | undefined,
): HTMLElement | null {
  if (container == null) {
    return typeof document !== "undefined" ? document.body : null;
  }
  if (typeof HTMLElement !== "undefined" && container instanceof HTMLElement) {
    return container;
  }
  if (typeof container === "object" && "current" in container) {
    return container.current;
  }
  return null;
}

export function Portal({ children, container = null }: SelectPortalProps) {
  const mountNode = resolvePortalContainer(container);

  if (!mountNode) {
    return null;
  }

  return (
    <PortalContext.Provider value>
      {createPortal(children, mountNode)}
    </PortalContext.Provider>
  );
}