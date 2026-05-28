# Headless DatePicker Primitive — Implementation Plan

## Context

Build a headless DatePicker primitive library for React/TypeScript, inspired by Ark UI's date-picker but with:

- **Zero external runtime dependencies** — only React, TypeScript, and native browser APIs
- **Truly headless** — no default styles; works with Tailwind, Panda CSS, CSS-in-JS, plain CSS
- **Fully accessible** — WAI-ARIA date picker pattern, keyboard navigation, screen reader support
- **State machine powered** — predictable behavior using a pure `useReducer` (replacing Zag JS)
- **Simpler API than Ark UI** — less nesting, `<DatePicker.Calendar />` as a self-contained shorthand

---

## Complexity Assessment

| Scope      | Timeline  | What's included                                                                        |
| ---------- | --------- | -------------------------------------------------------------------------------------- |
| MVP        | 1–2 weeks | Single selection, English locale, day view only, basic ARIA, open/close                |
| Mid-tier   | 3–4 weeks | + Month/year views, range mode, locale-aware week start, input parsing, focus trap     |
| Production | 5–6 weeks | + Multiple mode, full keyboard nav, animations, a11y audit, Storybook, full test suite |

**Hardest problems to get right:**

1. **Keyboard nav across month boundaries** — arrow key focus must cross month, re-rendering grid, with roving tabindex reassigned via `useEffect`
2. **Segmented input** — locale-aware field order/separators, independent spinbutton editing, and synchronization with calendar state
3. **Range mode UX** — anchor/extend/hover-preview state, two-input binding, preventing start > end
4. **Focus trap** — must re-query focusable elements on each Tab because view switching changes DOM
5. **Animation/presence** — `forceMount` requires a separate presence state (`entering | open | closing | closed`) to keep content in DOM during exit transitions

---

## API Design

### Simple (90% of use cases)

```tsx
<DatePicker.Root defaultValue={new Date()} onValueChange={(date) => console.log(date)}>
  <DatePicker.Label>Departure date</DatePicker.Label>
  <DatePicker.Input />
  <DatePicker.Trigger>Open calendar</DatePicker.Trigger>
  <DatePicker.Content>
    <DatePicker.Calendar /> {/* self-contained: nav header + weekdays + grid */}
  </DatePicker.Content>
</DatePicker.Root>
```

### Advanced (escape hatches for custom rendering)

```tsx
<DatePicker.Root value={date} onValueChange={setDate} locale="fr-FR">
  <DatePicker.Label>Date</DatePicker.Label>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.ViewControl>
      <DatePicker.PrevTrigger />
      <DatePicker.ViewTrigger />
      <DatePicker.NextTrigger />
    </DatePicker.ViewControl>
    <DatePicker.View view="day">
      <DatePicker.WeekDays />
      <DatePicker.Grid>
        {({ weeks }) =>
          weeks.map((week, wi) =>
            week.map((day, di) => (
              <DatePicker.Day key={`${wi}-${di}`} date={day}>
                {({ date, isSelected, isToday, isOutsideMonth, isDisabled }) => (
                  <span className={isSelected ? "selected" : ""}>{date.getDate()}</span>
                )}
              </DatePicker.Day>
            )),
          )
        }
      </DatePicker.Grid>
    </DatePicker.View>
    <DatePicker.View view="month">
      <DatePicker.MonthGrid>
        {({ months }) =>
          months.map((m) => (
            <DatePicker.MonthCell key={m.value} value={m.value}>
              {m.label}
            </DatePicker.MonthCell>
          ))
        }
      </DatePicker.MonthGrid>
    </DatePicker.View>
    <DatePicker.View view="year">
      <DatePicker.YearGrid>
        {({ years }) =>
          years.map((y) => (
            <DatePicker.YearCell key={y} value={y}>
              {y}
            </DatePicker.YearCell>
          ))
        }
      </DatePicker.YearGrid>
    </DatePicker.View>
  </DatePicker.Content>
</DatePicker.Root>
```

### Range mode

```tsx
<DatePicker.Root
  mode="range"
  value={{ start: startDate, end: endDate }}
  onValueChange={({ start, end }) => {
    setStart(start);
    setEnd(end);
  }}
>
  <DatePicker.Input
    index={0}
    segmentLabels={{ month: "Start month", day: "Start day", year: "Start year" }}
  />
  <DatePicker.Input
    index={1}
    segmentLabels={{ month: "End month", day: "End day", year: "End year" }}
  />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>
```

### Root Props (TypeScript)

```typescript
type DatePickerRootProps = DatePickerSharedProps &
  (DatePickerSingleProps | DatePickerRangeProps | DatePickerMultipleProps);

interface DatePickerSharedProps {
  locale?: string; // default: navigator.language
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // override locale default
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean | ((date: Date) => boolean);
  readOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean; // default: true — focus trap
  closeOnSelect?: boolean; // default: true for single, false for range/multiple
}
```

---

## Architecture

### State Machine (pure `useReducer`, no Zag JS)

```typescript
// reducer.ts — pure function, no React deps, fully testable
type ViewMode = "day" | "month" | "year";

interface DatePickerState {
  open: boolean;
  openSource: "trigger" | "input" | null;
  view: ViewMode;
  focusedMonth: number;
  focusedYear: number;
  focusedDate: Date | null;
  selectedDate: Date | null; // single mode
  rangeStart: Date | null; // range mode
  rangeEnd: Date | null; // range mode
  hoverDate: Date | null; // range preview
  selectedDates: Date[]; // multiple mode
  inputValue: string;
  yearPageStart: number; // first year in year grid
}

type DatePickerAction =
  | { type: "OPEN"; source?: "trigger" | "input" }
  | { type: "CLOSE" }
  | { type: "TOGGLE"; source?: "trigger" | "input" }
  | { type: "SET_VIEW"; view: ViewMode }
  | { type: "NAV_PREV" }
  | { type: "NAV_NEXT" }
  | { type: "FOCUS_DATE"; date: Date }
  | { type: "SELECT_DATE"; date: Date }
  | { type: "ANCHOR_DATE"; date: Date }
  | { type: "EXTEND_RANGE"; date: Date }
  | { type: "TOGGLE_DATE"; date: Date }
  | { type: "HOVER_DATE"; date: Date | null }
  | { type: "SET_INPUT"; value: string }
  | { type: "COMMIT_INPUT" }
  | { type: "SELECT_MONTH"; month: number }
  | { type: "SELECT_YEAR"; year: number }
  | { type: "YEAR_PAGE_PREV" }
  | { type: "YEAR_PAGE_NEXT" };
```

### Calendar Grid Algorithm

```typescript
// utils/calendar.ts
function buildCalendarGrid(year: number, month: number, weekStartDay: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1);
  const offset = (firstOfMonth.getDay() - weekStartDay + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = offset + daysInMonth <= 35 ? 5 : 6;
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => new Date(year, month, 1 - offset + row * 7 + col)),
  );
}

// utils/locale.ts — week start day from Intl API, zero external deps
function getWeekStartDay(locale: string, override?: number): number {
  if (override !== undefined) return override;
  try {
    const weekInfo = new Intl.Locale(locale).weekInfo;
    return weekInfo.firstDay === 7 ? 0 : weekInfo.firstDay;
  } catch {
    return 0;
  }
}
```

### Segmented Date Input

Phase 10 replaced the original plain text input with an Ark-inspired segmented date input. `DatePicker.Input` now renders a `role="group"` wrapper and three editable `role="spinbutton"` segments for month/day/year. The visible order and separator come from `Intl.DateTimeFormat.formatToParts` through `getSegmentInfo(locale)`, so locales such as `en-US` and `en-GB` render the fields in the expected order without extra dependencies.

```typescript
// utils/locale.ts
function getSegmentInfo(locale: string): {
  order: Array<"year" | "month" | "day">;
  separator: string;
};
```

Input behavior:

- Segment labels are customizable with `segmentLabels?: { month?, day?, year? }`.
- `placeholder` was removed; empty segments display `MM`, `DD`, and `YYYY` and expose `aria-valuetext="Blank"`.
- Digit entry uses a pending buffer: month/day can auto-advance when enough information is available, while year commits after four digits.
- `pendingRef` is the event-time source of truth for pending digits to avoid stale closure reads during rapid keyboard input.
- `useLayoutEffect` re-applies target segment focus synchronously after commits/auto-advance, before `MutationObserver` callbacks can move focus.
- The input syncs in both directions: reducer date state updates segment values, and complete valid segments dispatch selection/range/multiple actions.
- `openSource` records whether the calendar opened from the trigger or input so focus management can make the right decision.

### Context (2 layers, not 5)

```
DatePickerContext (state + dispatch + config + derived values)
  └─ DatePickerViewContext ({ view: 'day'|'month'|'year' })  — only for View component
```

### Keyboard Navigation (WAI-ARIA Grid Pattern)

| Context         | Key                | Behavior                                                         |
| --------------- | ------------------ | ---------------------------------------------------------------- |
| Segmented input | `0–9`              | Enter digits for focused segment; auto-advance when possible     |
| Segmented input | `ArrowUp/Down`     | Increment/decrement focused segment; month/day wrap, year clamps |
| Segmented input | `ArrowLeft/Right`  | Move between date segments                                       |
| Segmented input | `Backspace/Delete` | Clear pending/current segment, then move backward when empty     |
| Segmented input | `Escape`           | Close calendar                                                   |
| Grid            | `←→↑↓`             | Move focus 1 day / 1 week; auto-navigate months                  |
| Grid            | `PageUp/Down`      | Prev/next month                                                  |
| Grid            | `Ctrl+PageUp/Down` | Prev/next year                                                   |
| Grid            | `Home/End`         | First/last of week                                               |
| Grid            | `Enter/Space`      | Select focused date                                              |
| Grid            | `Escape`           | Close, return focus to trigger                                   |
| Month/Year grid | `←→↑↓`             | Move focus; ↓/↑ = ±3 (same column)                               |
| Month/Year grid | `Enter/Space`      | Select, drill down                                               |

---

## File Structure

```
src/
├── index.ts                         # public API surface
├── types.ts                         # all shared TypeScript types
├── utils/
│   ├── date.ts                      # isSameDay, isInRange, addDays, etc.
│   ├── calendar.ts                  # buildCalendarGrid, buildWeekDays, buildMonthItems
│   ├── locale.ts                    # getWeekStartDay, formatDate, parseDate, getSegmentInfo
│   └── aria.ts                      # generateId, mergeRefs, composeEventHandlers
└── date-picker/
    ├── context.ts                   # DatePickerContext + useDatePickerContext
    ├── reducer.ts                   # state machine (pure function)
    ├── use-date-picker.ts           # core hook: useReducer + controlled sync + derived values
    ├── use-focus-trap.ts            # focus trap for Content; guards segmented input focus
    ├── use-click-outside.ts         # close on outside click
    ├── use-roving-tabindex.ts       # roving tabindex for grid
    ├── root.tsx                     # DatePicker.Root
    ├── label.tsx                    # DatePicker.Label
    ├── input.tsx                    # DatePicker.Input (segmented spinbutton group)
    ├── trigger.tsx                  # DatePicker.Trigger
    ├── content.tsx                  # DatePicker.Content (focus trap + presence + input-open focus guard)
    ├── calendar.tsx                 # DatePicker.Calendar (convenience composite)
    ├── view.tsx                     # DatePicker.View (conditional render by view mode)
    ├── view-control.tsx             # DatePicker.ViewControl (nav header wrapper)
    ├── prev-trigger.tsx             # DatePicker.PrevTrigger
    ├── next-trigger.tsx             # DatePicker.NextTrigger
    ├── view-trigger.tsx             # DatePicker.ViewTrigger (cycle day→month→year)
    ├── week-days.tsx                # DatePicker.WeekDays (Mon/Tue/Wed header row)
    ├── grid.tsx                     # DatePicker.Grid (table role="grid" + spinbutton focus guard)
    ├── day.tsx                      # DatePicker.Day (gridcell with ARIA)
    ├── month-grid.tsx               # DatePicker.MonthGrid
    ├── month-cell.tsx               # DatePicker.MonthCell
    ├── year-grid.tsx                # DatePicker.YearGrid
    ├── year-cell.tsx                # DatePicker.YearCell
    └── index.ts                     # re-export as DatePicker namespace

tests/
├── reducer.test.ts
├── calendar-grid.test.ts
├── date-utils.test.ts
├── keyboard-nav.test.tsx            # includes segmented input keyboard/focus regressions
└── aria.test.tsx                    # includes segmented input ARIA coverage
```

---

## Dev Setup

**Tooling:** tsup (build) + Vitest + jsdom (tests) + Storybook React/Vite (demos) + @storybook/addon-a11y

**`package.json` key fields:**

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "sideEffects": false,
  "peerDependencies": { "react": ">=18.0.0", "react-dom": ">=18.0.0" },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tsup": "^8.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^24.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@storybook/addon-a11y": "^8.0.0"
  }
}
```

**tsup config:** ESM + CJS dual output, `dts: true`, `external: ['react', 'react-dom']`

---

## Recommended Implementation Order

1. **Day 1–2** — Scaffold (package.json, tsconfig, tsup, vitest). Write pure utility tests (`date.ts`, `calendar.ts`).
2. **Day 3–4** — `reducer.ts` (pure function, no React). Write all reducer transition tests.
3. **Day 5** — `context.ts` + `use-date-picker.ts`. Wire reducer into `useReducer`. Handle controlled/uncontrolled split.
4. **Day 6–7** — `root.tsx`, `input.tsx`, `trigger.tsx`, `content.tsx`. Basic open/close. `use-click-outside.ts`.
5. **Day 8–9** — `grid.tsx`, `day.tsx`, `week-days.tsx`, `view-control.tsx`, `prev/next-trigger.tsx`. Calendar renders and navigates.
6. **Day 10** — Keyboard navigation in grid. `use-roving-tabindex.ts`. Arrow key dispatch + `focusedDate` → DOM focus via `useEffect`.
7. **Week 3** — Focus trap, month/year views, `DatePicker.Calendar` composite, input parsing.
8. **Week 4** — Range mode, multiple mode, Storybook stories, a11y audit with axe.
9. **Week 5–6** — Edge cases (min/max, disabled fn, locale variants), performance (`useMemo` on grid), docs, README.
10. **Phase 10** — Rewrite `input.tsx` as locale-aware segmented spinbuttons; add `getSegmentInfo`; harden focus management in `content.tsx`, `use-focus-trap.ts`, and `grid.tsx`; add regression tests for input/calendar focus edge cases.
11. **Phase 11** — Run a `timescape` spike for segmented input robustness; use React Aria DateField/DatePicker behavior as the reference model; adopt `timescape` only if bundle, API, ARIA, focus, and test outcomes justify adding a runtime dependency.
12. **Phase 12** — Integrate `@floating-ui/dom` for `Content` positioning: viewport-aware flip/shift, `side`/`align`/`sideOffset` props, optional portal rendering.
13. **Phase 13** — Align story imports from internal `'../date-picker/index'` to public `'../index'`; no runtime changes, ensures stories accurately document consumer usage.

---

## Verification

1. **Unit tests:** `vitest run` — reducer transitions, calendar grid algorithm, locale utilities
2. **Component tests:** `@testing-library/react` + `@testing-library/user-event` — keyboard nav, segmented input behavior, ARIA attributes, focus management
3. **A11y audit:** `@storybook/addon-a11y` + axe-core in every story; test with VoiceOver/NVDA
4. **Type check:** `tsc --noEmit`
5. **Manual:** Storybook stories for single/range/multiple/custom-day/disabled
6. **Bundle check:** `tsup --analyze` — confirm zero runtime deps in output

---

## Phase 12 Plan — Floating UI Positioning

Goal: replace the zero-positioning `Content` div with an overlay that self-positions relative to
the trigger, handles viewport collision, and optionally renders in a portal.

### Why `@floating-ui/react-dom` and not `@floating-ui/dom` or `@floating-ui/react`

Both Radix UI (`@radix-ui/react-popper`) and Base UI (`@base-ui/react`) use `@floating-ui/react-dom`
(~6KB), not the raw DOM layer or the full React package. This is the right middle ground:

- `@floating-ui/dom` — pure DOM, no React bindings; you write the `useFloating` hook yourself.
  More work for the same result.
- `@floating-ui/react-dom` — exports `useFloating` ready-to-use in React. This is what Radix and
  Base UI ship with.
- `@floating-ui/react` (~10KB) — adds `FloatingPortal`, `FloatingFocusManager`, `useInteractions`,
  `useHover`, `useClick`, `useDismiss`. All redundant: this project already owns focus trap,
  click-outside, and portal (via `ReactDOM.createPortal`).

`@floating-ui/react-dom` gives `useFloating` for position computation and `autoUpdate` for
scroll/resize tracking — the only two primitives needed here.

### New `use-floating.ts` hook

```typescript
interface UseFloatingOptions {
  open: boolean;
  side?: "top" | "bottom" | "left" | "right"; // default: 'bottom'
  align?: "start" | "center" | "end"; // default: 'start'
  sideOffset?: number; // default: 4
  alignOffset?: number; // default: 0
  avoidCollisions?: boolean; // default: true
  collisionPadding?: number; // default: 8
}

interface UseFloatingReturn {
  referenceRef: RefCallback<HTMLElement>; // attach to trigger
  floatingRef: RefCallback<HTMLElement>; // attach to content
  floatingStyles: CSSProperties; // position: fixed + x/y
}
```

Middleware used when `avoidCollisions: true`: `offset(sideOffset)` + `flip()` + `shift({ padding: collisionPadding })`.
`autoUpdate` runs while the calendar is open; cleanup fires on close or unmount.

### Updated `Content` props

```typescript
interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number;
  portal?: boolean; // renders into document.body via ReactDOM.createPortal
}
```

The trigger element is resolved via `ids.trigger` (already used in click-outside and Escape focus
return), so no new context value is needed.

---

## Phase 13 Plan — Public API Import Alignment

Goal: make the internal stories accurately reflect how consumers use the package.

### The gap

`src/index.ts` already provides the correct public entry point:

```ts
// src/index.ts
export * as DatePicker from "./date-picker/index";
```

So consumers get the clean import:

```ts
import { DatePicker } from 'kairo-date-picker';

<DatePicker.Root>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>
```

But all story files bypass this and import directly from the internal path:

```ts
// current (internal, bypasses public API)
import * as DatePicker from "../date-picker/index";

// correct (mirrors consumer usage)
import { DatePicker } from "../index";
```

### Scope

Only the story files and `story-helpers.tsx` need updating. The `src/date-picker/index.ts` barrel
and `src/index.ts` are already correct. No runtime behavior changes.

---

## Current Implementation Status

The project is implemented through Phase 11. The custom segmented input was successfully replaced with `timescape`.

The main post-Phase-9 changes are:

- `src/date-picker/input.tsx` uses `timescape/react` for a robust, accessible segmented spinbutton input with locale-aware order/separators, segment labels, roving tabindex, digit buffering, increment/decrement controls, and two-way calendar sync.
- `src/utils/locale.ts` includes `getSegmentInfo(locale)` for segmented input metadata.
- `src/date-picker/reducer.ts` tracks `openSource` so focus behavior can distinguish input-opened and trigger-opened calendars.
- `src/date-picker/content.tsx`, `src/date-picker/use-focus-trap.ts`, and `src/date-picker/grid.tsx` include `spinbutton` guards to prevent calendar focus management from stealing focus while a user edits the input.
- Tests cover segmented input rendering, ARIA spinbutton attributes, digit entry, auto-advance, segment keyboard controls, calendar-to-input sync, and regressions where calendar DOM changes used to steal input focus.
- **Phase 11 (Timescape)**: `timescape` was integrated to manage the segmented input state, saving lines of code and ensuring robust partial date handling and touch keyboard behaviors. Build size increased by ~8KB but remains very lightweight (~43KB ESM), justifying the single dependency.

---

## Phase 11 Plan — Timescape Input Spike (Completed)

Goal: determine whether integrating `timescape` for the segmented input gives enough reliability and behavioral coverage to justify moving away from the current zero-runtime-dependency baseline.

Scope:

- Keep the date-picker core architecture intact: `useReducer`, context, calendar grid, range/multiple selection, focus trap, and public compound API remain owned by this project.
- Evaluate `timescape` only for `DatePicker.Input` segment editing behavior.
- Use React Aria's DateField/DatePicker behavior as a reference for keyboard UX, ARIA semantics, locale-aware segment ordering, screen reader expectations, touch/mobile behavior, and validation messaging.
- Do not adopt React Aria/Stately as implementation dependencies unless a separate future phase explicitly decides to replace the state model.

Spike acceptance criteria:

- Existing tests continue passing, especially segmented input and focus-stealing regressions.
- New tests cover any behavior gained from `timescape`, including partial input, invalid values, min/max handling, segment navigation, and calendar sync.
- The public `DatePicker.Input` API remains compatible or has a clearly justified migration path.
- Bundle size increase is measured against the current build and documented.
- `input.tsx` becomes simpler or demonstrably more correct; an adapter layer that is larger/more fragile than the current implementation is not acceptable.
- Accessibility behavior is at least as strong as the current `role="group"` + segment controls, with React Aria used as the comparison target.

Expected outcomes:

- **Adopt**: keep `timescape` if it materially improves segment behavior with acceptable bundle/API cost.
- **Reject**: keep the custom input if `timescape` adds dependency weight or adapter complexity without clear user-facing wins.
- **Borrow ideas**: preserve zero dependencies but port selected behavior patterns from `timescape` and React Aria into the custom input.
