import { useCallback, type KeyboardEvent } from "react";

export type KeyboardShortcutHandler = (event: KeyboardEvent) => void | boolean;

export type KeyboardShortcutBindings = Record<string, KeyboardShortcutHandler>;

export interface UseKeyboardShortcutsOptions {
  bindings: KeyboardShortcutBindings;
  direction?: "ltr" | "rtl";
  allowRepeat?: boolean;
  enabled?: boolean;
}

function normalizeKey(key: string): string {
  if (key === " ") return "Space";
  if (key.length === 1) return key.toLowerCase();
  return key;
}

function parseShortcut(shortcut: string): {
  shift: boolean;
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  key: string;
} {
  const parts = shortcut.split("+").map((p) => p.trim());
  let shift = false;
  let alt = false;
  let ctrl = false;
  let meta = false;
  let key = "";

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower === "shift") shift = true;
    else if (lower === "alt") alt = true;
    else if (lower === "control" || lower === "ctrl") ctrl = true;
    else if (lower === "meta" || lower === "cmd") meta = true;
    else if (lower === "mod") {
      const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
      if (isMac) meta = true;
      else ctrl = true;
    } else {
      key = normalizeKey(part);
    }
  }

  return { shift, alt, ctrl, meta, key };
}

function matchesShortcut(
  event: KeyboardEvent,
  shortcut: string,
  direction: "ltr" | "rtl",
): boolean {
  const parsed = parseShortcut(shortcut);
  let key = normalizeKey(event.key);

  if (direction === "rtl") {
    if (key === "arrowleft") key = "arrowright";
    else if (key === "arrowright") key = "arrowleft";
  }

  const eventKey = key.toLowerCase();
  const parsedKey = parsed.key.toLowerCase();

  return (
    event.shiftKey === parsed.shift &&
    event.altKey === parsed.alt &&
    event.ctrlKey === parsed.ctrl &&
    event.metaKey === parsed.meta &&
    eventKey === parsedKey
  );
}

export function useKeyboardShortcuts({
  bindings,
  direction = "ltr",
  allowRepeat = false,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      if (event.nativeEvent?.repeat && !allowRepeat) return;
      if (event.nativeEvent?.isComposing) return;

      for (const [shortcut, handler] of Object.entries(bindings)) {
        if (!matchesShortcut(event, shortcut, direction)) continue;
        const result = handler(event);
        if (result !== false) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
    },
    [bindings, direction, allowRepeat, enabled],
  );

  return { onKeyDown };
}
