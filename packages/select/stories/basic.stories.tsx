import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../src/index";

const meta = {
  title: "Select/Basic",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ── Uncontrolled basic ───────────────────────────────────────────────────────

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ fontFamily: "sans-serif", minWidth: 240 }}>
      <Select.Root name="framework" defaultValue="react">
        <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          Framework
        </Select.Label>
        <Select.Trigger
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 6,
            background: "white",
            cursor: "pointer",
          }}
        >
          <Select.Value placeholder="Choose a framework…" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content
          style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            padding: "4px 0",
            outline: "none",
          }}
        >
          <Select.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" },
              { value: "solid", label: "Solid", disabled: true },
              { value: "angular", label: "Angular" },
            ].map(({ value, label, disabled }) => (
              <Select.Item
                key={value}
                value={value}
                disabled={disabled}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.4 : 1,
                }}
              >
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

// ── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("vue");

    return (
      <div style={{ fontFamily: "sans-serif", minWidth: 240 }}>
        <p style={{ marginBottom: 8, fontSize: 14, color: "#666" }}>
          Selected: <code>{value ?? "(none)"}</code>
        </p>
        <Select.Root name="framework" value={value} onValueChange={setValue}>
          <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Framework (controlled)
          </Select.Label>
          <Select.Trigger
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              background: "white",
              cursor: "pointer",
            }}
          >
            <Select.Value placeholder="Choose…" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content
            style={{
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,.12)",
              padding: "4px 0",
              outline: "none",
            }}
          >
            <Select.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {["React", "Vue", "Svelte", "Angular"].map((label) => {
                const val = label.toLowerCase();
                return (
                  <Select.Item
                    key={val}
                    value={val}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <Select.ItemText>{label}</Select.ItemText>
                    <Select.ItemIndicator value={val}>✓</Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.List>
          </Select.Content>
          <Select.HiddenSelect />
        </Select.Root>
      </div>
    );
  },
};

// ── With groups ──────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => (
    <div style={{ fontFamily: "sans-serif", minWidth: 240 }}>
      <Select.Root name="lang">
        <Select.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          Language
        </Select.Label>
        <Select.Trigger
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 6,
            background: "white",
            cursor: "pointer",
          }}
        >
          <Select.Value placeholder="Choose a language…" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content
          style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            padding: "4px 0",
            outline: "none",
          }}
        >
          <Select.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <Select.Group>
              <Select.GroupLabel
                style={{ padding: "4px 12px", fontSize: 12, color: "#888", fontWeight: 600 }}
              >
                Frontend
              </Select.GroupLabel>
              {["typescript", "javascript"].map((val) => (
                <Select.Item
                  key={val}
                  value={val}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", cursor: "pointer" }}
                >
                  <Select.ItemText>{val.charAt(0).toUpperCase() + val.slice(1)}</Select.ItemText>
                  <Select.ItemIndicator value={val}>✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
            <Select.Group>
              <Select.GroupLabel
                style={{ padding: "4px 12px", fontSize: 12, color: "#888", fontWeight: 600 }}
              >
                Backend
              </Select.GroupLabel>
              {["python", "rust", "go"].map((val) => (
                <Select.Item
                  key={val}
                  value={val}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", cursor: "pointer" }}
                >
                  <Select.ItemText>{val.charAt(0).toUpperCase() + val.slice(1)}</Select.ItemText>
                  <Select.ItemIndicator value={val}>✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.List>
        </Select.Content>
        <Select.HiddenSelect />
      </Select.Root>
    </div>
  ),
};
