import type { SelectItemRecord } from "../types";

/** Resolve display label: registry wins over static map, then raw value. */
export function resolveItemLabel(
  value: string,
  registry: Map<string, SelectItemRecord>,
  staticItems: Record<string, string>,
): string {
  return registry.get(value)?.label ?? staticItems[value] ?? value;
}

/** Merge option values from registry and static items (registry order first). */
export function mergeOptionValues(
  registry: Map<string, SelectItemRecord>,
  staticItems: Record<string, string>,
): string[] {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const value of registry.keys()) {
    if (!seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }

  for (const value of Object.keys(staticItems)) {
    if (!seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }

  return values;
}