import React from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";
import { mergeOptionValues, resolveItemLabel } from "../utils/labels";

export function HiddenSelect() {
  const { store, config } = useSelectContext();
  const value = useSelectStore(store, (s) => s.value);
  const registry = useSelectStore(store, (s) => s.items);

  if (!config.name) return null;

  const optionValues = mergeOptionValues(registry, config.items);
  const selectedValues = config.multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string"
      ? [value]
      : [];

  if (config.multiple) {
    const allOptionValues = [
      ...optionValues,
      ...selectedValues.filter(
        (selected) => !optionValues.some((v) => config.isItemEqualToValue(v, selected)),
      ),
    ];

    return (
      <select
        aria-hidden="true"
        tabIndex={-1}
        name={config.name}
        multiple
        required={config.required}
        disabled={config.disabled}
        value={selectedValues}
        onChange={() => undefined}
        style={{
          position: "absolute",
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: 0,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: 0,
        }}
        data-part="hidden-select"
      >
        {allOptionValues.map((optionValue) => {
          const record = registry.get(optionValue);
          return (
            <option key={optionValue} value={optionValue} disabled={record?.disabled}>
              {resolveItemLabel(optionValue, registry, config.items)}
            </option>
          );
        })}
      </select>
    );
  }

  const singleValue = typeof value === "string" ? value : "";
  const hasValueOption =
    singleValue !== "" && optionValues.some((v) => config.isItemEqualToValue(v, singleValue));

  return (
    <select
      aria-hidden="true"
      tabIndex={-1}
      name={config.name}
      required={config.required}
      disabled={config.disabled}
      value={singleValue}
      onChange={() => undefined}
      style={{
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: 0,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        opacity: 0,
      }}
      data-part="hidden-select"
    >
      <option value="" disabled hidden />
      {optionValues.map((optionValue) => {
        const record = registry.get(optionValue);
        return (
          <option key={optionValue} value={optionValue} disabled={record?.disabled}>
            {resolveItemLabel(optionValue, registry, config.items)}
          </option>
        );
      })}
      {singleValue !== "" && !hasValueOption && <option value={singleValue}>{singleValue}</option>}
    </select>
  );
}