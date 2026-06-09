import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

interface ItemElementProps {
  value?: string;
  children?: ReactNode;
}

function extractItemTextLabel(children: ReactNode): string | null {
  let label: string | null = null;

  Children.forEach(children, (child) => {
    if (label != null || !isValidElement(child)) return;

    const element = child as ReactElement<ItemElementProps>;
    const type = element.type as { displayName?: string; name?: string };
    const isItemText = type?.displayName === "Select.ItemText" || type?.name === "ItemText";

    if (isItemText) {
      const content = element.props.children;
      if (typeof content === "string" || typeof content === "number") {
        label = String(content);
      }
      return;
    }

    if (element.props.children != null) {
      label = extractItemTextLabel(element.props.children);
    }
  });

  return label;
}

function isSelectItemElement(child: ReactElement<ItemElementProps>): boolean {
  const type = child.type as { displayName?: string; name?: string };
  return type?.displayName === "Select.Item" || type?.name === "Item";
}

/** Walk the Root children tree and collect value→label pairs from Item/ItemText. */
export function extractItemsFromChildren(children: ReactNode): Record<string, string> {
  const items: Record<string, string> = {};

  const walk = (node: ReactNode): void => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const element = child as ReactElement<ItemElementProps>;

      if (isSelectItemElement(element)) {
        const value = element.props.value;
        const label = extractItemTextLabel(element.props.children) ?? value;
        if (value != null && label != null) {
          items[value] = label;
        }
      }

      if (element.props.children != null) {
        walk(element.props.children);
      }
    });
  };

  walk(children);
  return items;
}
