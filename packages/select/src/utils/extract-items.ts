import { Children, isValidElement, type ReactNode } from "react";

function extractItemTextLabel(children: ReactNode): string | null {
  let label: string | null = null;

  Children.forEach(children, (child) => {
    if (label != null || !isValidElement(child)) return;

    const type = child.type as { displayName?: string; name?: string };
    const isItemText =
      type?.displayName === "Select.ItemText" || type?.name === "ItemText";

    if (isItemText) {
      const content = child.props.children;
      if (typeof content === "string" || typeof content === "number") {
        label = String(content);
      }
      return;
    }

    if (child.props?.children != null) {
      label = extractItemTextLabel(child.props.children);
    }
  });

  return label;
}

function isSelectItemElement(child: React.ReactElement): boolean {
  const type = child.type as { displayName?: string; name?: string };
  return type?.displayName === "Select.Item" || type?.name === "Item";
}

/** Walk the Root children tree and collect value→label pairs from Item/ItemText. */
export function extractItemsFromChildren(children: ReactNode): Record<string, string> {
  const items: Record<string, string> = {};

  const walk = (node: ReactNode): void => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      if (isSelectItemElement(child)) {
        const value = child.props.value as string | undefined;
        const label = extractItemTextLabel(child.props.children) ?? value;
        if (value != null && label != null) {
          items[value] = label;
        }
      }

      if (child.props?.children != null) {
        walk(child.props.children);
      }
    });
  };

  walk(children);
  return items;
}