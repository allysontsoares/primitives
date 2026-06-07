import React from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";

export function HiddenSelect() {
  const { store, config } = useSelectContext();
  const value = useSelectStore(store, (s) => s.value);
  const items = useSelectStore(store, (s) => s.items);

  if (!config.name) return null;

  const registered = Array.from(items.values());
  const hasValueOption =
    value != null && registered.some((item) => item.value === value);

  return (
    <select
      aria-hidden="true"
      tabIndex={-1}
      name={config.name}
      required={config.required}
      disabled={config.disabled}
      value={value ?? ""}
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
      {registered.map((item) => (
        <option key={item.value} value={item.value} disabled={item.disabled}>
          {item.label}
        </option>
      ))}
      {value != null && !hasValueOption && <option value={value}>{value}</option>}
    </select>
  );
}