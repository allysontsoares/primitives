/**
 * Internal source of truth for Date Picker doc demo styles.
 * Exports plain class strings for live demos and code snippets — snippets never import tv().
 */

export const DP_LABEL_CLS = "text-[13px] font-semibold text-zinc-200 dark:text-zinc-300";

export const DP_FIELD_WRAP_CLS = "flex flex-col gap-2 w-[260px]";

export const DP_DATE_FIELD_WRAP_CLS = "flex w-fit max-w-full flex-col items-start gap-2";

export const DP_CONTROL_ROW_CLS = "flex items-center gap-2";

const DP_SEGMENT_FOCUS =
  "[&_input]:rounded-md [&_input]:transition-[background-color,color,box-shadow] [&_input:focus]:!bg-indigo-600 [&_input:focus]:!text-white dark:[&_input:focus]:!bg-indigo-500 dark:[&_input:focus]:!text-white [&_input:focus]:shadow-sm [&_input::selection]:bg-transparent [&_input::placeholder]:text-zinc-500 dark:[&_input::placeholder]:text-zinc-400 [&_[data-separator]]:font-medium [&_[data-separator]]:text-zinc-500 dark:[&_[data-separator]]:text-zinc-400";

const DP_INPUT_FOCUS_WITHIN =
  "transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:bg-zinc-950 focus-within:shadow-[0_0_0_3px_rgb(99_102_241_/_0.18)] dark:focus-within:shadow-[0_0_0_3px_rgb(129_140_248_/_0.18)]";

const DP_INPUT_BASE =
  "inline-flex h-[42px] items-center justify-start gap-0.5 rounded-[10px] border border-zinc-300/90 bg-white px-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

const DP_SEGMENT_PADDING =
  "[&_input]:px-1 [&_input]:py-0.5 [&_[data-separator]]:select-none [&_[data-separator]]:px-0.5";

/** Popover path — input beside trigger (flex-1). Same segment look as date field. */
export const DP_PICKER_INPUT_CLS = [
  DP_INPUT_BASE,
  "min-w-0 flex-1",
  DP_INPUT_FOCUS_WITHIN,
  DP_SEGMENT_FOCUS,
  DP_SEGMENT_PADDING,
].join(" ");

/** Date field only — shrinks to segment width. */
export const DP_DATE_FIELD_INPUT_CLS = [
  DP_INPUT_BASE,
  "w-fit cursor-text",
  DP_INPUT_FOCUS_WITHIN,
  DP_SEGMENT_FOCUS,
  DP_SEGMENT_PADDING,
].join(" ");

export const DP_TRIGGER_CLS = [
  "grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-[10px]",
  "border border-zinc-300/90 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300",
  "transition-[border-color,background-color,color,transform,box-shadow] duration-150",
  "hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:border-indigo-400/70 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
  "active:scale-[0.97]",
  "aria-expanded:border-indigo-500 aria-expanded:bg-indigo-50 aria-expanded:text-indigo-700 dark:aria-expanded:border-indigo-400 dark:aria-expanded:bg-indigo-500/15 dark:aria-expanded:text-indigo-300",
  "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const DP_CAL_TABLE =
  "[&_table]:!table-fixed [&_table]:!w-full [&_table]:!border-collapse [&_table]:!border-spacing-0 [&_tr]:!table-row [&_td]:!table-cell [&_td]:!p-0 [&_td]:!text-center [&_th]:!table-cell [&_th]:!p-0 [&_th]:!text-center [&_thead]:!table-header-group [&_tbody]:!table-row-group";

/** Composed calendar popover shell (Default demo). */
export const DP_POPOVER_SHELL_CLS = [
  "w-[280px] min-w-[280px] rounded-[14px] border border-zinc-200/90 bg-zinc-50 p-3.5 shadow-lg shadow-zinc-900/5",
  "dark:border-zinc-700/80 dark:bg-zinc-900 dark:shadow-black/30",
  DP_CAL_TABLE,
].join(" ");

/** Calendar shorthand popover — same shell + data-* cell selectors (Quick start). */
export const DP_CAL_SHORTHAND_POPOVER_CLS = [
  DP_POPOVER_SHELL_CLS,
  "[&_[role=group]]:mb-2.5 [&_[role=group]]:flex [&_[role=group]]:items-center [&_[role=group]]:justify-between",
  "[&_table_th]:text-[12px] [&_table_th]:font-bold [&_table_th]:uppercase [&_table_th]:tracking-[0.05em] [&_table_th]:text-zinc-600 [&_table_th]:py-2 dark:[&_table_th]:text-zinc-300",
  "[&_[role=gridcell]]:relative [&_[role=gridcell]]:mx-auto [&_[role=gridcell]]:size-[36px] [&_[role=gridcell]]:rounded-lg [&_[role=gridcell]]:text-[14px] [&_[role=gridcell]]:font-medium [&_[role=gridcell]]:tabular-nums [&_[role=gridcell]]:text-zinc-800 [&_[role=gridcell]]:transition-[background-color,color] [&_[role=gridcell]]:duration-150",
  "dark:[&_[role=gridcell]]:text-zinc-100",
  "[&_[role=gridcell]]:hover:bg-indigo-50 [&_[role=gridcell]]:hover:text-indigo-900 dark:[&_[role=gridcell]]:hover:bg-indigo-500/15 dark:[&_[role=gridcell]]:hover:text-indigo-100",
  "[&_[role=gridcell][data-selected]]:bg-indigo-600 [&_[role=gridcell][data-selected]]:font-semibold [&_[role=gridcell][data-selected]]:text-white",
  "dark:[&_[role=gridcell][data-selected]]:bg-indigo-500 dark:[&_[role=gridcell][data-selected]]:text-white",
  "[&_[role=gridcell][data-today]:not([data-selected])]:font-bold [&_[role=gridcell][data-today]:not([data-selected])]:text-indigo-600 dark:[&_[role=gridcell][data-today]:not([data-selected])]:text-indigo-400",
  "[&_[role=gridcell][data-outside-month]]:text-zinc-400 dark:[&_[role=gridcell][data-outside-month]]:text-zinc-500",
  "[&_[role=gridcell][data-disabled]]:cursor-not-allowed [&_[role=gridcell][data-disabled]]:opacity-30",
  "[&_button[aria-label^='Go']]:grid [&_button[aria-label^='Go']]:size-[30px] [&_button[aria-label^='Go']]:place-items-center [&_button[aria-label^='Go']]:rounded-lg [&_button[aria-label^='Go']]:text-zinc-600 [&_button[aria-label^='Go']]:transition-colors [&_button[aria-label^='Go']]:hover:bg-indigo-50 [&_button[aria-label^='Go']]:hover:text-indigo-700 dark:[&_button[aria-label^='Go']]:text-zinc-300 dark:[&_button[aria-label^='Go']]:hover:bg-indigo-500/15 dark:[&_button[aria-label^='Go']]:hover:text-indigo-300",
  "[&_button[aria-label^='Switch']]:rounded-lg [&_button[aria-label^='Switch']]:px-2.5 [&_button[aria-label^='Switch']]:py-1 [&_button[aria-label^='Switch']]:text-[15px] [&_button[aria-label^='Switch']]:font-[650] [&_button[aria-label^='Switch']]:text-zinc-900 [&_button[aria-label^='Switch']]:hover:bg-indigo-50 [&_button[aria-label^='Switch']]:hover:text-indigo-700 dark:[&_button[aria-label^='Switch']]:text-zinc-100 dark:[&_button[aria-label^='Switch']]:hover:bg-indigo-500/15 dark:[&_button[aria-label^='Switch']]:hover:text-indigo-300",
].join(" ");

export const DP_FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900";

export const DP_HEAD_NAV_CLS = [
  "grid place-items-center w-[30px] h-[30px] shrink-0 rounded-lg text-zinc-600 dark:text-zinc-300",
  "transition-[background-color,color,transform,box-shadow] duration-150",
  "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
  "active:scale-95 disabled:pointer-events-none disabled:opacity-35",
  DP_FOCUS_RING,
].join(" ");

export const DP_HEAD_TITLE_CLS = [
  "rounded-lg px-2.5 py-1 text-[15px] font-[650] text-zinc-900 dark:text-zinc-100",
  "transition-[background-color,color,box-shadow] duration-150",
  "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
  "active:bg-indigo-100/80 dark:active:bg-indigo-500/25",
  DP_FOCUS_RING,
].join(" ");

export const DP_WEEKDAY_CLS =
  "text-[12px] font-bold text-zinc-600 dark:text-zinc-300 py-2 text-center uppercase tracking-[0.05em]";

export const DP_SELECTED_CLS =
  "aria-selected:bg-indigo-600 aria-selected:text-white aria-selected:font-semibold dark:aria-selected:bg-indigo-500 dark:aria-selected:text-white aria-selected:hover:bg-indigo-700 dark:aria-selected:hover:bg-indigo-400 aria-selected:shadow-sm aria-selected:shadow-indigo-600/25";

export const DP_DAY_CLS = [
  "relative z-0 mx-auto grid size-[36px] cursor-default place-items-center rounded-lg text-[14px] font-medium tabular-nums",
  "transition-[background-color,color,box-shadow,transform] duration-150",
  "hover:bg-indigo-50 hover:text-indigo-900 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-100",
  "text-zinc-800 dark:text-zinc-100",
  "data-disabled:cursor-not-allowed data-disabled:opacity-30 data-disabled:hover:bg-transparent",
  DP_SELECTED_CLS,
  "data-[today]:font-bold data-[today]:[&:not([aria-selected=true])]:text-indigo-600 dark:data-[today]:[&:not([aria-selected=true])]:text-indigo-400",
  "data-[outside-month]:text-zinc-400 dark:data-[outside-month]:text-zinc-500",
  DP_FOCUS_RING,
].join(" ");

/* ── CSS tab strings (match Tailwind demo tokens) ── */

export const DP_FIELD_CSS = `.dp-label {
  font-size: 13px;
  font-weight: 600;
  color: #e4e4e7;
}

.dp-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 260px;
}

.dp-date-field-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: fit-content;
}

.dp-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dp-input {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(212, 212, 216, 0.9);
  background: #fff;
  color: #18181b;
  font-family: ui-monospace, monospace;
  font-size: 14px;
  transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
}

.dp-input:focus-within {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
  outline: none;
}

.dp-input input {
  border: none;
  background: transparent;
  padding: 2px 4px;
  margin: 0;
  text-align: center;
  font: inherit;
  outline: none;
  border-radius: 6px;
  transition: background-color 0.15s, color 0.15s, box-shadow 0.15s;
}

.dp-input input:focus {
  background: #4f46e5;
  color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.dp-input input::selection {
  background: transparent;
}

.dp-input [data-separator] {
  font-weight: 500;
  color: #71717a;
  padding: 0 2px;
  user-select: none;
}

.dp-date-field {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  width: fit-content;
  height: 42px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(212, 212, 216, 0.9);
  background: #fff;
  color: #18181b;
  font-family: ui-monospace, monospace;
  font-size: 14px;
  cursor: text;
}

.dp-date-field:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
  outline: none;
}

.dp-date-field input {
  border: none;
  background: transparent;
  padding: 2px 4px;
  text-align: center;
  font: inherit;
  outline: none;
  border-radius: 6px;
}

.dp-date-field input:focus {
  background: #4f46e5;
  color: #fff;
}

.dp-trigger {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid rgba(212, 212, 216, 0.9);
  background: #fff;
  color: #52525b;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s, color 0.15s, transform 0.15s;
}

.dp-trigger:hover,
.dp-trigger[aria-expanded="true"] {
  border-color: #6366f1;
  background: #eef2ff;
  color: #4338ca;
}`;

export const DP_POPOVER_SHELL_CSS = `.dp-popover {
  width: 280px;
  min-width: 280px;
  border-radius: 14px;
  border: 1px solid rgba(228, 228, 231, 0.9);
  background: #fafafa;
  padding: 14px;
  box-shadow: 0 10px 24px rgba(24, 24, 27, 0.08);
}`;

export const DP_DAY_CSS = `.dp-day {
  position: relative;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin: 0 auto;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: #27272a;
  cursor: default;
  transition: background 0.15s ease, color 0.15s ease;
}

.dp-day:hover {
  background: #eef2ff;
  color: #312e81;
}

.dp-day[aria-selected="true"],
.dp-day[data-selected] {
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
}

.dp-day[data-outside-month] {
  color: #a1a1aa;
}

.dp-day[data-disabled] {
  opacity: 0.3;
  pointer-events: none;
}`;

export const DP_CAL_SHORTHAND_CSS = `${DP_POPOVER_SHELL_CSS}

/* Calendar shorthand — never use display:flex/grid on td[role=gridcell] */
.dp-popover table[role="grid"] {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.dp-popover table[role="grid"] td,
.dp-popover table[role="grid"] th {
  display: table-cell;
  padding: 0;
  text-align: center;
  vertical-align: middle;
}

.dp-popover [role="group"] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.dp-popover table[role="grid"] th {
  font-size: 12px;
  font-weight: 700;
  color: #52525b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 0;
}

.dp-popover [role="gridcell"] {
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: #27272a;
  transition: background 0.15s, color 0.15s;
}

.dp-popover [role="gridcell"]:hover:not([data-disabled]) {
  background: #eef2ff;
  color: #312e81;
}

.dp-popover [role="gridcell"][data-selected] {
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
}

.dp-popover [role="gridcell"][data-outside-month] {
  color: #a1a1aa;
}

.dp-popover [role="gridcell"][data-disabled] {
  opacity: 0.3;
  pointer-events: none;
}`;

/** Shared Panda field tokens (popover path). */
export const DP_PANDA_FIELD_BLOCK = `const label = css({ fontSize: "13px", fontWeight: "semibold", color: { base: "zinc.200", _dark: "zinc.300" } });
const input = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "2px",
  flex: 1,
  minWidth: 0,
  height: "42px",
  paddingX: "10px",
  borderRadius: "10px",
  borderWidth: "1px",
  borderColor: { base: "rgba(212, 212, 216, 0.9)", _dark: "zinc.700" },
  backgroundColor: { base: "white", _dark: "zinc.950" },
  color: { base: "zinc.900", _dark: "zinc.100" },
  fontFamily: "mono",
  fontSize: "14px",
  "& input": { border: "none", background: "transparent", padding: "2px 4px", textAlign: "center", outline: "none", borderRadius: "6px" },
  "& input:focus": { background: "indigo.600", color: "white", _dark: { background: "indigo.500", color: "white" } },
  "& [data-separator]": { fontWeight: "medium", color: "zinc.500", paddingX: "2px" },
});
const trigger = css({
  display: "grid",
  placeItems: "center",
  width: "42px",
  height: "42px",
  flexShrink: 0,
  borderRadius: "10px",
  borderWidth: "1px",
  borderColor: { base: "rgba(212, 212, 216, 0.9)", _dark: "zinc.700" },
  backgroundColor: { base: "white", _dark: "zinc.950" },
  color: { base: "zinc.600", _dark: "zinc.300" },
});`;

export const DP_PANDA_DATE_FIELD_INPUT = `const dateField = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  width: "fit-content",
  height: "42px",
  paddingX: "10px",
  borderRadius: "10px",
  borderWidth: "1px",
  borderColor: { base: "rgba(212, 212, 216, 0.9)", _dark: "zinc.700" },
  backgroundColor: { base: "white", _dark: "zinc.950" },
  color: { base: "zinc.900", _dark: "zinc.100" },
  fontFamily: "mono",
  fontSize: "14px",
  cursor: "text",
  "& input:focus": { background: "indigo.600", color: "white", _dark: { background: "indigo.500", color: "white" } },
});`;
