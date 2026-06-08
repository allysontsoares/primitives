import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../src/index";

const meta = {
  title: "Select/Multiple",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const triggerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "white",
  cursor: "pointer",
};

const contentStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #ddd",
  borderRadius: 6,
  boxShadow: "0 4px 12px rgba(0,0,0,.12)",
  padding: "4px 0",
  outline: "none",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  cursor: "pointer",
};

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular" },
] as const;

// ── Uncontrolled multiple ─────────────────────────────────────────────────────

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ fontFamily: "sans-serif", minWidth: 280 }}>
      <Select.Root name="frameworks" multiple defaultValue={["react", "vue"]}>
        <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          Frameworks
        </Select.Label>
        <Select.Trigger style={triggerStyle}>
          <Select.Value placeholder="Choose frameworks…" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content style={contentStyle}>
          <Select.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {FRAMEWORKS.map(({ value, label }) => (
              <Select.Item key={value} value={value} style={itemStyle}>
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator value={value}>✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
        <Select.HiddenSelect />
      </Select.Root>
    </div>
  ),
};

// ── Controlled multiple ───────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["react"]);

    return (
      <div style={{ fontFamily: "sans-serif", minWidth: 280 }}>
        <p style={{ marginBottom: 8, fontSize: 14, color: "#666" }}>
          Selected: <code>{value.length ? value.join(", ") : "(none)"}</code>
        </p>
        <Select.Root name="frameworks" multiple value={value} onValueChange={setValue}>
          <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Frameworks (controlled)
          </Select.Label>
          <Select.Trigger style={triggerStyle}>
            <Select.Value placeholder="Choose frameworks…" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content style={contentStyle}>
            <Select.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {FRAMEWORKS.map(({ value: v, label }) => (
                <Select.Item key={v} value={v} style={itemStyle}>
                  <Select.ItemText>{label}</Select.ItemText>
                  <Select.ItemIndicator value={v}>✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Content>
          <Select.HiddenSelect />
        </Select.Root>
      </div>
    );
  },
};