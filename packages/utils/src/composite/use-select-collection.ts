import { useMemo } from "react";

export interface SelectCollectionItem {
  value: string;
  label: string;
  textValue: string;
  disabled: boolean;
}

export type SelectCollectionFilterFn = (
  item: SelectCollectionItem,
  inputValue: string,
) => boolean;

export interface UseSelectCollectionOptions {
  items: SelectCollectionItem[] | Map<string, SelectCollectionItem>;
  inputValue: string;
  filter?: SelectCollectionFilterFn | undefined;
}

function defaultFilter(item: SelectCollectionItem, inputValue: string): boolean {
  const query = inputValue.trim().toLowerCase();
  if (!query) return true;
  return (
    item.textValue.toLowerCase().includes(query) ||
    item.label.toLowerCase().includes(query)
  );
}

function toItemArray(
  items: SelectCollectionItem[] | Map<string, SelectCollectionItem>,
): SelectCollectionItem[] {
  return items instanceof Map ? Array.from(items.values()) : items;
}

/**
 * Filter a select/combobox item collection by `inputValue`.
 * Used by Combobox for type-to-filter; not required on Select Root.
 */
export function useSelectCollection({
  items,
  inputValue,
  filter = defaultFilter,
}: UseSelectCollectionOptions) {
  const collection = useMemo(() => {
    const all = toItemArray(items);
    return all.filter((item) => filter(item, inputValue));
  }, [items, inputValue, filter]);

  const enabledItems = useMemo(
    () => collection.filter((item) => !item.disabled),
    [collection],
  );

  return {
    items: collection,
    enabledItems,
    isEmpty: collection.length === 0,
  };
}