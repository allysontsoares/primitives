# Segmented Input Gaps

## 1. Partial input behavior and invalid segment recovery

- **Issue**: `tryCommit` only commits to the reducer when _all_ segments form a valid date. If a single segment is cleared or becomes invalid, `tryCommit` bails out.
- **Problem**: `values` state has the local state (e.g., `null`), but `sourceDate` in `useEffect` won't sync back up unless the selected date changes externally. The reducer state acts as truth, but partial inputs are essentially floating local state. Also, out-of-bounds days (e.g. typing 31 for February) do not auto-correct; they just silently prevent commitment.

## 2. Touch/mobile numeric input behavior

- **Issue**: The segments are `<span>` with `role="spinbutton"` and capture keyboard events (`onKeyDown`).
- **Problem**: Mobile virtual keyboards might not reliably fire `e.key` with digits. Furthermore, without an actual `<input type="number">` or `inputMode="numeric"`, mobile devices do not automatically pull up the numeric keyboard, making it very cumbersome for mobile users to type a date.

## 3. Locale-specific segment order/separator edge cases

- **Issue**: The current logic relies on `Intl.DateTimeFormat.formatToParts` to find literal separators and takes the first non-whitespace literal it finds, defaulting to `/`.
- **Problem**: Certain locales have complex separators (e.g. `YYYY. MM. DD.` in Korean or `DD de MM de YYYY` in Spanish) which differ between segments. The current implementation only renders a single string (like `/`) between all segments uniformly, ignoring the rich structure provided by `formatToParts`.

## 4. Screen reader output for group/segment navigation

- **Issue**: The group only has `role="group"` and `aria-labelledby`, and segments only use `role="spinbutton"` with `aria-valuetext="Blank"`.
- **Problem**: React Aria typically provides richer announcements (e.g. `aria-roledescription="segment"`, localized labels, and clear instructions). A user navigating the input might lack context on how to interact with the segments compared to the robust announcements from React Aria DateField.
