# DatePicker — To-Do / Progress Tracker

Status legend: `[ ]` pending · `[~]` in progress · `[x]` done

---

## Phase 1 — Scaffold ✅

- [x] `package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`, `tests/setup.ts`
- [x] `docs/PLAN.md` + `docs/TODO.md`
- [x] `pnpm install`
- [x] `src/types.ts`
- [x] `src/utils/date.ts` — 31 tests ✅
- [x] `src/utils/calendar.ts` — 20 tests ✅
- [x] `src/utils/locale.ts` (+ ISO date timezone fix)
- [x] `src/utils/aria.ts`

---

## Phase 2 — State Machine ✅

- [x] `src/date-picker/reducer.ts` — 36 tests ✅
  - [x] All transitions: OPEN/CLOSE/TOGGLE, NAV_PREV/NEXT, SELECT_DATE (single/range/multiple)
  - [x] ANCHOR_DATE, EXTEND_RANGE, TOGGLE_DATE, HOVER_DATE
  - [x] SELECT_MONTH, SELECT_YEAR, YEAR_PAGE_PREV/NEXT
  - [x] SET_INPUT, COMMIT_INPUT
  - [x] `createInitialState` — initializes `focusedDate` when `open=true`

---

## Phase 3 — Core Hook & Context ✅

- [x] `src/date-picker/context.ts` — `DatePickerContext`, `DatePickerViewContext`, `MonthGridFocusContext`, `YearGridFocusContext`
- [x] `src/date-picker/use-date-picker.ts`
  - [x] `useReducer` wiring
  - [x] Controlled open (`props.open` + `onOpenChange`)
  - [x] External callbacks: `onValueChange` for single/range/multiple modes
  - [x] Derived values via `useMemo`
  - [x] `exactOptionalPropertyTypes`-safe config resolution

---

## Phase 4 — Basic UI ✅

- [x] `use-click-outside.ts` — excludes trigger from click-outside detection
- [x] `use-focus-trap.ts` — MutationObserver re-queries after view switches
- [x] `root.tsx`, `label.tsx`, `input.tsx`, `trigger.tsx`
- [x] `content.tsx` — focus-stealing only on trigger open, not input focus

---

## Phase 5 — Calendar Grid ✅

- [x] `view-control.tsx`, `prev-trigger.tsx`, `next-trigger.tsx`, `view-trigger.tsx`
- [x] `view.tsx`, `week-days.tsx`
- [x] `grid.tsx` — `header` prop avoids `<table>` nesting; keyboard nav (←→↑↓, PgUp/Dn, Home/End)
- [x] `day.tsx` — all `data-*` attributes, render prop, range hover
- [x] `month-grid.tsx`, `month-cell.tsx`, `year-grid.tsx`, `year-cell.tsx`
- [x] `calendar.tsx` — convenience composite (`<DatePicker.Calendar />`)
- [x] `src/index.ts` — public API
- [x] Build: ~35KB ESM+CJS, zero runtime deps ✅

---

## Phase 6 — Keyboard Navigation & Tests ✅

- [x] `use-roving-tabindex.ts`
- [x] Grid: ←→↑↓, PageUp/Down, Ctrl+PageUp/Down, Home/End, Enter/Space, Escape
- [x] Input: ArrowDown/Up (open), Enter (commit), Escape (close)
- [x] `tests/aria.test.tsx` — 26 tests ✅ (Label, segmented Input, Trigger, Content, Grid, WeekDays, Day, Nav buttons)
- [x] `tests/keyboard-nav.test.tsx` — 33 tests ✅ (Trigger click, segmented Input keyboard, Calendar nav, Day selection, Grid keyboard, focus regressions)

---

## Phase 7 — Storybook ✅

- [x] Storybook initialized (`@storybook/react-vite`)
- [x] `@storybook/addon-a11y` configured
- [x] `src/stories/single.stories.tsx` — Default, Uncontrolled, Controlled, WithMinMax, DisabledWeekends, Inline, FrenchLocale, CustomDayRender
- [x] `src/stories/range.stories.tsx` — Default (two inputs), WithCalendarShorthand
- [x] `src/stories/multiple.stories.tsx` — Default

---

## Phase 8 — Month/Year Keyboard Nav & Accessibility ✅

- [x] Month grid keyboard nav (`←→` ±1, `↑↓` ±3, `PageUp/Down` ±1 year, `Escape` → day view)
- [x] Year grid keyboard nav + pager (`←→` ±1, `↑↓` ±4, `PageUp/Down` ±1 page, `Escape` → month view)
- [x] Focus trap: `MutationObserver` re-queries focusable elements after view switches
- [x] `aria-live="polite"` region in Content for screen reader navigation announcements
- [x] `readOnly` mode — blocks selection, allows navigation
- [x] `README.md` — full API reference

---

## Phase 9 — Polish & Production ✅

- [x] `readOnly` mode implemented in `input.tsx` + `day.tsx`
- [x] `ReadOnly` Storybook story added to `single.stories.tsx`
- [x] `ForceMountAnimation` story — demonstrates `forceMount` + CSS `[data-state]` animations
- [x] `src/stories/locales.stories.tsx` — en-US, en-GB, fr-FR, ar (RTL), ja-JP
- [x] `pnpm storybook build` — all 14 stories compile and build cleanly

---

## Phase 10 — Segmented Date Input ✅

Inspired by Ark UI's `DateInput` component. Replaces the plain `<input type="text">` with a
locale-aware segmented spinbutton group where month, day, and year are independently editable.
Zero new dependencies — uses only `Intl.DateTimeFormat.formatToParts`.

- [x] **`src/utils/locale.ts`** — added `getSegmentInfo(locale): { order, separator }`
  - Returns field order and separator from `Intl.DateTimeFormat.formatToParts`
  - e.g. en-US → `{ order: ['month','day','year'], separator: '/' }`
  - e.g. en-GB → `{ order: ['day','month','year'], separator: '/' }`
- [x] **`src/date-picker/input.tsx`** — complete rewrite as segmented spinbutton group
  - DOM: `role="group"` wrapper with three `role="spinbutton"` spans
  - ARIA: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext="Blank"` per segment
  - Roving tabindex: first segment is `tabIndex=0`; focused segment takes over
  - Two-way sync: reducer `selectedDate`/`rangeStart`/`rangeEnd` → local segment values via `useEffect`; completed segments → `dispatch(SELECT_DATE/ANCHOR_DATE/EXTEND_RANGE)` via `tryCommit`
  - Digit entry with auto-advance: month ≥ 2 commits immediately; month 0/1 waits for second digit; day ≥ 4 commits immediately; year accumulates 4 digits
  - `pendingRef` (in addition to `pending` state) avoids stale-closure reads of pending in `handleKeyDown`
  - `useLayoutEffect` re-applies focus to the target segment synchronously after each commit/advance — fires before `MutationObserver` callbacks, preventing async focus-theft when the calendar navigates to a different month
  - `InputProps`: added `segmentLabels?: { month?, day?, year? }` for i18n label customization; removed `placeholder` prop
  - Keyboard: `0–9` digit entry, `ArrowUp/Down` increment/decrement with wrapping, `ArrowLeft/Right` segment navigation, `Backspace/Delete` clear + prev segment, `Escape` close calendar
- [x] **`src/date-picker/reducer.ts`** — added `OpenSource = 'trigger' | 'input' | null` + `openSource` field to state; `OPEN` action accepts optional `source`
- [x] **`src/date-picker/content.tsx`** — focus effect now checks `state.openSource === 'input'` (early return) AND `activeRole === 'spinbutton'`; depends on `[isOpen, state.openSource]`
- [x] **`src/date-picker/use-focus-trap.ts`** — `MutationObserver` callback guards `role="spinbutton"` before recapturing focus
- [x] **`src/date-picker/grid.tsx`** — `useEffect` guards `role="spinbutton"` before moving DOM focus to focused day cell; prevents focus-theft when month changes (e.g. May 6-row → January 5-row removes a `<tr>`)
- [x] **`tests/aria.test.tsx`** — rewrote Input describe block: `getByRole('group')` + `getAllByRole('spinbutton')`, ARIA attribute assertions, `aria-valuetext="Blank"` for empty segments
- [x] **`tests/keyboard-nav.test.tsx`** — rewrote Input keyboard tests: digit entry, ArrowUp/Down, ArrowLeft/Right, Backspace, auto-advance, Calendar↔Input sync; added regression tests for pre-filled date focus-theft

---

## Phase 11 — Timescape Input Spike & React Aria Reference ✅

Evaluate whether `timescape` should replace or harden the custom segmented `DatePicker.Input`.
React Aria is the behavioral reference, not the planned implementation dependency.

- [x] Document current segmented input gaps before changing code
  - [x] Partial input behavior and invalid segment recovery
  - [x] Touch/mobile numeric input behavior
  - [x] Locale-specific segment order/separator edge cases
  - [x] Screen reader output for group/segment navigation
- [x] Install and spike `timescape` in an isolated branch/change
  - [x] Integrate only inside `DatePicker.Input`; keep reducer, context, calendar grid, range/multiple modes, and compound API intact
  - [x] Map project segment fields (`month`, `day`, `year`) to `timescape` fields (`months`, `days`, `years`)
  - [x] Preserve calendar → input sync and input → reducer dispatch behavior
  - [x] Preserve `segmentLabels`, `index`, readOnly, min/max/disabled handling, and locale order/separator behavior
- [x] Use React Aria DateField/DatePicker as behavior benchmark
  - [x] Compare segment keyboard behavior: digit entry, ArrowUp/Down, ArrowLeft/Right, Backspace/Delete, Escape
  - [x] Compare ARIA output: group labeling, segment labels, value text, invalid/placeholder state
  - [x] Compare focus behavior when the calendar opens from input versus trigger
  - [x] Compare validation/commit timing for partial and invalid dates
- [x] Add/adjust tests for the spike
  - [x] Existing 146 tests must keep passing
  - [x] Add tests for invalid partial input and recovery
  - [x] Add tests for min/max or disabled-date rejection from segmented input
  - [x] Add tests for focus retention during calendar month changes
  - [x] Add tests for locale field order with `en-US`, `en-GB`, and at least one non-Latin/RTL locale if feasible
- [x] Measure cost
  - [x] Compare bundle size before/after `timescape`
  - [x] Compare `input.tsx` complexity before/after integration
  - [x] Document whether `timescape` introduces runtime dependency cost that conflicts with the zero-dependency baseline
- [x] Decide outcome
  - [x] Adopt `timescape` if behavior improves and bundle/API cost is acceptable
  - [ ] Reject `timescape` if the adapter layer is more complex than the current input
  - [ ] Borrow selected behavior from `timescape`/React Aria while keeping zero dependencies if that is the better tradeoff

---

## Current Status

**146 tests passing · 0 type errors · ~43KB build (1 runtime dep: `timescape`)**

Verified on 2026-05-27 with `pnpm test --run` and `pnpm run type-check`.

All 11 implementation phases complete. Phase 11 (Timescape) was adopted successfully!

---

## Notes

- Reference: `/home/allysonsoares/dev/ark/packages/react/src/components/date-picker/` + `date-input/`
- Phase 11 references: `timescape` for possible segmented input implementation; React Aria DateField/DatePicker for behavior and accessibility benchmarking
- Zero deps: native `Date` + `Intl` API replaces `@internationalized/date`; `useReducer` replaces Zag JS
- Context: 2 layers (`DatePickerContext` + `DatePickerViewContext`) vs Ark's 5
- `data-*` attributes on `Day` enable pure-CSS styling
- `MonthCell`/`YearCell` have `role="gridcell"` (not `"button"`) — query accordingly in tests
- ISO date parsing uses explicit regex to avoid UTC timezone shift
- `exactOptionalPropertyTypes: true` — use conditional spread for optional props
- Segmented input: `pendingRef` is the source of truth for the pending digit buffer during keyboard events; `pending` state drives display only
- `useLayoutEffect` in `input.tsx` fires before `MutationObserver` (which fires as a microtask), ensuring focus lands on the correct spinbutton before any async focus-management code runs
