import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../src/index";

const meta = {
  title: "Select/Portal",
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
  zIndex: 50,
};

const itemStyle: React.CSSProperties = {
  padding: "8px 12px",
  cursor: "pointer",
};

const OPTIONS = [
  { value: "pt", label: "Portugal" },
  { value: "br", label: "Brazil" },
  { value: "es", label: "Spain" },
] as const;

// ── Portal to document.body ───────────────────────────────────────────────────

export const BodyPortal: Story = {
  render: () => (
    <div
      style={{
        fontFamily: "sans-serif",
        minWidth: 240,
        overflow: "hidden",
        height: 120,
        border: "1px dashed #ccc",
        padding: 16,
      }}
    >
      <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
        Parent has overflow:hidden — portal escapes clipping.
      </p>
      <Select.Root name="country">
        <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          Country
        </Select.Label>
        <Select.Trigger style={triggerStyle}>
          <Select.Value placeholder="Choose…" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content portal style={contentStyle} sameWidth>
          <Select.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {OPTIONS.map(({ value, label }) => (
              <Select.Item key={value} value={value} style={itemStyle}>
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
        <Select.HiddenSelect />
      </Select.Root>
    </div>
  ),
};

// ── Portal into a custom container (e.g. Dialog.Content) ─────────────────────

export const CustomContainer: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
      <div style={{ fontFamily: "sans-serif", minWidth: 320 }}>
        <div
          ref={containerRef}
          style={{
            position: "relative",
            border: "2px solid #6366f1",
            borderRadius: 8,
            padding: 16,
            minHeight: 200,
          }}
        >
          <p style={{ fontSize: 12, color: "#6366f1", marginBottom: 12, fontWeight: 600 }}>
            Dialog.Content (portal container)
          </p>
          <Select.Root name="country">
            <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
              Country
            </Select.Label>
            <Select.Trigger style={triggerStyle}>
              <Select.Value placeholder="Choose…" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content portal container={containerRef} style={contentStyle} sameWidth>
              <Select.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {OPTIONS.map(({ value, label }) => (
                  <Select.Item key={value} value={value} style={itemStyle}>
                    <Select.ItemText>{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Content>
            <Select.HiddenSelect />
          </Select.Root>
        </div>
      </div>
    );
  },
};