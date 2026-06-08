import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "../src/index";

const meta = {
  title: "Combobox/Basic",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const LANGUAGES = [
  { value: "ts", label: "TypeScript" },
  { value: "js", label: "JavaScript" },
  { value: "py", label: "Python" },
  { value: "rs", label: "Rust" },
  { value: "go", label: "Go" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
};

const triggerStyle: React.CSSProperties = {
  padding: "8px 10px",
  border: "1px solid #ccc",
  borderLeft: "none",
  borderRadius: "0 6px 6px 0",
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
  padding: "8px 12px",
  cursor: "pointer",
};

// ── Uncontrolled basic ───────────────────────────────────────────────────────

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ fontFamily: "sans-serif", minWidth: 280 }}>
      <Combobox.Root name="language">
        <Combobox.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          Language
        </Combobox.Label>
        <div style={{ display: "flex" }}>
          <Combobox.Input placeholder="Search languages…" style={{ ...inputStyle, borderRadius: "6px 0 0 6px" }} />
          <Combobox.Trigger style={triggerStyle}>▼</Combobox.Trigger>
        </div>
        <Combobox.Content style={contentStyle}>
          <Combobox.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {LANGUAGES.map(({ value, label }) => (
              <Combobox.Item key={value} value={value} style={itemStyle}>
                <Combobox.ItemText>{label}</Combobox.ItemText>
              </Combobox.Item>
            ))}
          </Combobox.List>
          <Combobox.Empty style={{ padding: "8px 12px", color: "#888", fontSize: 14 }}>
            No languages found
          </Combobox.Empty>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  ),
};

// ── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("js");
    const [inputValue, setInputValue] = useState("JavaScript");

    return (
      <div style={{ fontFamily: "sans-serif", minWidth: 280 }}>
        <p style={{ marginBottom: 8, fontSize: 14, color: "#666" }}>
          Selected: <code>{value ?? "(none)"}</code>
        </p>
        <Combobox.Root
          value={value}
          onValueChange={setValue}
          inputValue={inputValue}
          onInputValueChange={setInputValue}
        >
          <Combobox.Label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Language (controlled)
          </Combobox.Label>
          <div style={{ display: "flex" }}>
            <Combobox.Input placeholder="Search…" style={{ ...inputStyle, borderRadius: "6px 0 0 6px" }} />
            <Combobox.Trigger style={triggerStyle}>▼</Combobox.Trigger>
            <Combobox.Clear
              style={{
                marginLeft: 8,
                padding: "8px 10px",
                border: "1px solid #ccc",
                borderRadius: 6,
                cursor: "pointer",
                alignSelf: "center",
              }}
            >
              ✕
            </Combobox.Clear>
          </div>
          <Combobox.Content style={contentStyle}>
            <Combobox.List style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {LANGUAGES.map(({ value: val, label }) => (
                <Combobox.Item key={val} value={val} style={itemStyle}>
                  <Combobox.ItemText>{label}</Combobox.ItemText>
                </Combobox.Item>
              ))}
            </Combobox.List>
            <Combobox.Empty style={{ padding: "8px 12px", color: "#888", fontSize: 14 }}>
              No languages found
            </Combobox.Empty>
          </Combobox.Content>
        </Combobox.Root>
      </div>
    );
  },
};