# Contributing to Kenos UI

## Package naming

| Layer            | Convention                      | Example                                        |
| ---------------- | ------------------------------- | ---------------------------------------------- |
| Monorepo folder  | short name, no framework prefix | `packages/datepicker/`                         |
| npm package      | `@kenos-ui/react-<primitive>`   | `@kenos-ui/react-datepicker`                   |
| Import namespace | PascalCase                      | `DatePicker`, `Select`                         |
| Aggregator       | `@kenos-ui/react`               | `import { DatePicker } from '@kenos-ui/react'` |

## Shared tooling

- `tooling/tsconfig.package.json` — base TS config for primitives
- `tooling/package-tsup.ts` — library build defaults
- `tooling/package-vitest.ts` — test defaults

## Docs

- Brand & architecture: `docs/brand.md`, `docs/kenos/`
- Future evolution plans: `docs/datepicker/`, `docs/select/`
- Layout target: `docs/package-structure.md`
- Popup behavior: `docs/popup-policy.md`

## State management convention

Kenos primitives use one of two internal state patterns. Pick based on how state changes and who needs to subscribe — not on personal preference.

| Primitive             | Pattern                                            | Why                                                                                                   |
| --------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **DatePicker**        | **Reducer** (`datePickerReducer`)                  | Finite view machine: month/year/decade views, single/range selection modes, discrete transitions      |
| **Select**            | **Store** (`SelectStore` + `useSyncExternalStore`) | Item registry from JSX children, `highlightedValue` updates every keypress — parts subscribe narrowly |
| **Combobox** (Tier 3) | **Store** (extends Select shape)                   | Same registry + list navigation, plus `inputValue` and filter-driven collection updates               |

### DatePicker — reducer

DatePicker models calendar navigation and selection as a **finite state machine**: actions like `NAVIGATE_MONTH`, `SELECT_DAY`, and `SET_VIEW` produce predictable next states. A reducer fits because:

- The domain is **bounded** (known views, known selection modes).
- Transitions are **event-driven** and easy to test in isolation.
- Multiple parts read the same coherent snapshot without fine-grained subscriptions.

See [docs/datepicker/plan.md](./docs/datepicker/plan.md) — _Principles → Reducer, not machine_ and `packages/datepicker/src/date-picker/reducer.ts`.

### Select — store

Select uses a lightweight **store** with granular subscriptions (`useSyncExternalStore`). A store fits because:

- Each `Select.Item` **registers/unregisters** on mount/unmount — high churn, map-shaped registry.
- `highlightedValue` changes on every arrow key or typeahead character — only list/trigger parts should re-render.
- `Select.Value` resolves labels from the registry without re-walking the React tree.

See [docs/select/plan.md](./docs/select/plan.md) — _State: Store (decision)_ and `packages/select/src/store.ts`.

### Combobox — store + input/filter

Combobox is a **separate package** (`@kenos-ui/react-combobox`) that reuses the Select store _pattern_ (not a package dependency on `@kenos-ui/react-select`). It adds:

- `inputValue` on the store
- Filtered item collection (optional `useSelectCollection` hook — Combobox-only)
- Creatable/async/limit behaviors

Shared popup, dismiss, and composite utilities live in `packages/utils/` only.

See [docs/select/plan.md](./docs/select/plan.md) — _Tier 3 — Combobox foundation_.

### Choosing for new primitives

| Choose **reducer** when…                                       | Choose **store** when…                                           |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| State is a **finite machine** (views, steps, modes)            | Children **register** dynamic data at runtime                    |
| Updates are **coarse** action batches                          | One field updates **very frequently** (highlight, scroll, input) |
| You want **pure transition tests** (`(state, action) → state`) | Parts need **narrow subscriptions** to avoid list re-renders     |
| Examples: DatePicker views, Wizard steps, Tabs panel index     | Examples: Select, Combobox, Menu with roving index               |

**Do not** mix both in one primitive unless boundaries are clear (e.g. reducer for view mode, store for a child registry). **Do not** add cross-primitive package dependencies — share behavior through `packages/utils/` only.

## Release process

Kenos UI publishes to npm under the **`@kenos-ui`** org. [Changesets](https://github.com/changesets/changesets) manages **independent** versioning — each `@kenos-ui/*` package has its own semver line (`fixed` / `linked` are empty; no release train). See [.changeset/README.md](./.changeset/README.md) for policy details.

**Requirements:** Node **22+** (`engines.node` in root `package.json`), pnpm **10.14+**.

Internal apps (`apps/web`, `apps/playground`, `apps/storybook`) are listed in `.changeset/config.json` `ignore` and are never published.

### 1. Record changes (contributors)

After a user-facing change, add a changeset and commit the generated file with your PR:

```bash
pnpm changeset
```

Select affected packages (`@kenos-ui/react-datepicker`, `@kenos-ui/react`, …), choose semver bump (`patch` / `minor` / `major`), and write a short changelog summary.

### 2. Version packages (maintainers)

When ready to release, apply changesets — this bumps `package.json` versions and updates per-package `CHANGELOG.md` files:

```bash
pnpm changeset version
```

Commit the version bumps (and any dependency updates Changesets made).

### 3. Build publishable packages

Build only workspace libraries under `packages/` (apps and examples are not published):

```bash
pnpm turbo build --filter=./packages/*
```

Or use the root shortcut (same build step, then publish):

```bash
pnpm release
```

`pnpm release` runs `turbo run build --filter=./packages/*` followed by `changeset publish`.

### 4. Publish to npm

If you did not use `pnpm release`, publish manually after a green build:

```bash
pnpm changeset publish
```

Ensure you are logged into npm with access to **`@kenos-ui`** (`npm whoami`, `npm login`).

### GitHub Actions (`NPM_TOKEN`)

The Release workflow publishes with `secrets.NPM_TOKEN`. A **404 on publish** for packages that already exist on npm almost always means the token cannot write to that package.

Create or update the token at [npmjs.com → Access Tokens](https://www.npmjs.com/settings/~tokens):

1. Prefer a **Granular Access Token** with:
   - Packages and scopes: **Read and write**
   - Scope: **`@kenos-ui`** (all packages under the org), not only individual package names
2. Or use a **Classic Automation** token with publish permission for your account.
3. Add it as the `NPM_TOKEN` repository secret in GitHub.

The token must be able to publish **every** public package: `@kenos-ui/utils`, `@kenos-ui/react-datepicker`, `@kenos-ui/react-select`, `@kenos-ui/react-combobox`, and `@kenos-ui/react`. If `react-select` / `react-combobox` publish from CI but `react` / `react-datepicker` fail with `E404`, the token is scoped too narrowly.

For a **datepicker-only** release, add a changeset only for `@kenos-ui/react-datepicker`. Do not bump `@kenos-ui/react` or `@kenos-ui/utils` unless their APIs changed — `changeset publish` skips packages whose version already matches npm.

### Quick reference

| Step            | Command                                  |
| --------------- | ---------------------------------------- |
| Add changeset   | `pnpm changeset`                         |
| Apply versions  | `pnpm changeset version`                 |
| Build packages  | `pnpm turbo build --filter=./packages/*` |
| Publish         | `pnpm changeset publish`                 |
| Build + publish | `pnpm release`                           |
