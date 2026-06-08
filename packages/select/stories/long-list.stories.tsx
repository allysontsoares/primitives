import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../src/index";

const meta = {
  title: "Select/LongList",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const ITEMS = Array.from({ length: 120 }, (_, index) => ({
  value: `item-${index + 1}`,
  label: `Option ${index + 1}`,
}));

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
  padding: 0,
  outline: "none",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const scrollButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "#f5f5f5",
  padding: "4px 0",
  cursor: "pointer",
  fontSize: 12,
  lineHeight: 1,
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  maxHeight: 240,
  overflowY: "auto",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  cursor: "pointer",
};

export const WithScrollButtons: Story = {
  render: () => (
    <div style={{ fontFamily: "sans-serif", minWidth: 280 }}>
      <Select.Root name="long-list" defaultValue="item-1">
        <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          Long list (120 items)
        </Select.Label>
        <Select.Trigger style={triggerStyle}>
          <Select.Value placeholder="Choose an option…" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content style={contentStyle}>
          <Select.ScrollUpButton style={scrollButtonStyle} />
          <Select.List style={listStyle}>
            {ITEMS.map(({ value, label }) => (
              <Select.Item key={value} value={value} style={itemStyle}>
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator value={value}>✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.List>
          <Select.ScrollDownButton style={scrollButtonStyle} />
        </Select.Content>
        <Select.HiddenSelect />
      </Select.Root>
    </div>
  ),
};

export const AlignItemWithTrigger: Story = {
  render: () => (
    <div style={{ fontFamily: "sans-serif", minWidth: 280 }}>
      <Select.Root name="aligned-list" defaultValue="item-42">
        <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          alignItemWithTrigger
        </Select.Label>
        <Select.Trigger style={triggerStyle}>
          <Select.Value placeholder="Choose an option…" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content style={contentStyle} alignItemWithTrigger side="bottom">
          <Select.ScrollUpButton style={scrollButtonStyle} />
          <Select.List style={listStyle}>
            {ITEMS.map(({ value, label }) => (
              <Select.Item key={value} value={value} style={itemStyle}>
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator value={value}>✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.List>
          <Select.ScrollDownButton style={scrollButtonStyle} />
        </Select.Content>
        <Select.HiddenSelect />
      </Select.Root>
    </div>
  ),
};

export const OpenOnFocus: Story = {
  render: () => {
    const [focused, setFocused] = useState(false);

    return (
      <div style={{ fontFamily: "sans-serif", minWidth: 280 }}>
        <p style={{ marginBottom: 8, fontSize: 14, color: "#666" }}>
          Tab to the trigger — list opens on focus. Focused:{" "}
          <code>{focused ? "yes" : "no"}</code>
        </p>
        <Select.Root name="open-on-focus" openOnFocus>
          <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            openOnFocus
          </Select.Label>
          <Select.Trigger
            style={triggerStyle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <Select.Value placeholder="Tab here…" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content style={{ ...contentStyle, padding: "4px 0" }}>
            <Select.List style={{ ...listStyle, maxHeight: "none", overflowY: "visible" }}>
              {ITEMS.slice(0, 8).map(({ value, label }) => (
                <Select.Item key={value} value={value} style={itemStyle}>
                  <Select.ItemText>{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Content>
        </Select.Root>
      </div>
    );
  },
};