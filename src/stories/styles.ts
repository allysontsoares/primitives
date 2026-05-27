// Inline style helpers used by stories — no stylesheet needed.
// Real apps would use Tailwind / CSS modules / etc.
export const vars = {
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  muted: '#6b7280',
  border: '#e5e7eb',
  bg: '#ffffff',
  hover: '#f3f4f6',
  radius: '6px',
  shadow: '0 4px 16px rgba(0,0,0,0.12)',
};

export const baseCalendarStyles = `
  .dp-content {
    background: ${vars.bg};
    border: 1px solid ${vars.border};
    border-radius: ${vars.radius};
    box-shadow: ${vars.shadow};
    padding: 12px;
    width: 280px;
    margin-top: 4px;
  }
  .dp-view-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .dp-content [role="group"]:not(.dp-input) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .dp-nav-btn {
    background: none;
    border: 1px solid ${vars.border};
    border-radius: ${vars.radius};
    cursor: pointer;
    padding: 4px 8px;
    font-size: 16px;
    color: ${vars.muted};
  }
  .dp-nav-btn:hover,
  .dp-content button[aria-label^="Go to"]:hover { background: ${vars.hover}; }
  .dp-content button[aria-label^="Go to"] {
    background: none;
    border: 1px solid ${vars.border};
    border-radius: ${vars.radius};
    cursor: pointer;
    padding: 4px 8px;
    font-size: 16px;
    color: ${vars.muted};
  }
  .dp-view-trigger {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: ${vars.radius};
  }
  .dp-view-trigger:hover,
  .dp-content button[aria-label^="Switch"]:hover { background: ${vars.hover}; }
  .dp-content button[aria-label^="Switch"] {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: ${vars.radius};
  }
  .dp-grid {
    width: 100%;
    border-collapse: collapse;
  }
  .dp-content table[role="grid"] {
    width: 100%;
    border-collapse: collapse;
  }
  .dp-grid th,
  .dp-content table[role="grid"] th {
    font-size: 11px;
    color: ${vars.muted};
    text-align: center;
    padding: 4px 0;
    font-weight: 500;
  }
  .dp-day,
  .dp-content table[role="grid"] [role="gridcell"] {
    text-align: center;
    padding: 0;
    cursor: pointer;
    border-radius: ${vars.radius};
    font-size: 13px;
    height: 32px;
    width: 32px;
    line-height: 32px;
    user-select: none;
  }
  .dp-day:focus-visible,
  .dp-content [role="gridcell"]:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${vars.primary};
  }
  .dp-day:hover:not([data-disabled]),
  .dp-content table[role="grid"] [role="gridcell"]:hover:not([data-disabled]) { background: ${vars.hover}; }
  .dp-day[data-selected],
  .dp-content [role="gridcell"][data-selected] { background: ${vars.primary}; color: #fff; }
  .dp-day[data-today]:not([data-selected]),
  .dp-content table[role="grid"] [role="gridcell"][data-today]:not([data-selected]) { font-weight: 700; color: ${vars.primary}; }
  .dp-day[data-outside-month],
  .dp-content table[role="grid"] [role="gridcell"][data-outside-month] { color: ${vars.border}; }
  .dp-day[data-disabled],
  .dp-content [role="gridcell"][data-disabled],
  .dp-content [role="gridcell"]:disabled { color: ${vars.border}; cursor: not-allowed; }
  .dp-day[data-in-range],
  .dp-content [role="gridcell"][data-in-range] { background: ${vars.primaryLight}; }
  .dp-day[data-range-start],
  .dp-day[data-range-end],
  .dp-content [role="gridcell"][data-range-start],
  .dp-content [role="gridcell"][data-range-end] { background: ${vars.primary}; color: #fff; }
  .dp-field-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .dp-hint {
    margin-bottom: 8px;
    font-size: 12px;
    color: ${vars.muted};
    max-width: 460px;
    line-height: 1.45;
  }
  .dp-status {
    margin-bottom: 12px;
    font-size: 13px;
    color: ${vars.muted};
  }
  .dp-input {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border: 1px solid ${vars.border};
    border-radius: ${vars.radius};
    padding: 6px 10px;
    font-size: 14px;
    outline: none;
    min-width: 154px;
    width: auto;
    background: ${vars.bg};
    cursor: text;
    user-select: none;
  }
  .dp-input:focus-within {
    border-color: ${vars.primary};
    box-shadow: 0 0 0 2px ${vars.primaryLight};
  }
  .dp-input[data-disabled],
  .dp-input[data-readonly] {
    background: #f9fafb;
    color: ${vars.muted};
    cursor: default;
  }
  .dp-input[data-readonly] input:disabled {
    color: inherit;
    background: transparent;
    cursor: default;
  }
  .dp-input [role="spinbutton"] {
    border-radius: 4px;
    padding: 1px 2px;
    text-align: center;
    outline: none;
  }
  .dp-input [data-segment="month"],
  .dp-input [data-segment="day"] {
    min-width: 2ch;
  }
  .dp-input [data-segment="year"] {
    min-width: 4ch;
  }
  .dp-input [role="spinbutton"]:focus {
    background: ${vars.primaryLight};
    color: #1d4ed8;
  }
  .dp-input [data-placeholder] {
    color: ${vars.muted};
  }
  .dp-input [data-separator] {
    color: ${vars.muted};
  }
  .dp-trigger {
    border: 1px solid ${vars.border};
    border-radius: ${vars.radius};
    background: none;
    cursor: pointer;
    padding: 6px 10px;
    font-size: 14px;
  }
  .dp-trigger:hover:not(:disabled) { background: ${vars.hover}; }
  .dp-trigger:disabled { opacity: 0.5; cursor: not-allowed; }
  .dp-label { font-size: 13px; font-weight: 500; display: block; margin-bottom: 4px; }
  .dp-month-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    padding: 4px 0;
  }
  .dp-month-cell,
  .dp-content div[role="grid"] [role="gridcell"] {
    border: none;
    background: none;
    cursor: pointer;
    padding: 6px;
    border-radius: ${vars.radius};
    font-size: 12px;
    text-align: center;
  }
  .dp-month-cell:hover,
  .dp-content div[role="grid"] [role="gridcell"]:hover:not(:disabled) { background: ${vars.hover}; }
  .dp-month-cell[data-selected],
  .dp-content div[role="grid"] [role="gridcell"][data-selected] { background: ${vars.primary}; color: #fff; }
  .dp-year-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 4px 0;
  }
  .dp-year-cell {
    border: none;
    background: none;
    cursor: pointer;
    padding: 6px;
    border-radius: ${vars.radius};
    font-size: 12px;
    text-align: center;
  }
  .dp-year-cell:hover { background: ${vars.hover}; }
  .dp-year-cell[data-selected] { background: ${vars.primary}; color: #fff; }
`;
