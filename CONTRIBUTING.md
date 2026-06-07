# Contributing to Kenos UI

## Package naming

| Layer | Convention | Example |
|-------|------------|---------|
| Monorepo folder | short name, no framework prefix | `packages/datepicker/` |
| npm package | `@kenos-ui/react-<primitive>` | `@kenos-ui/react-datepicker` |
| Import namespace | PascalCase | `DatePicker`, `Select` |
| Aggregator | `@kenos-ui/react` | `import { DatePicker } from '@kenos-ui/react'` |

## Shared tooling

- `tooling/tsconfig.package.json` — base TS config for primitives
- `tooling/package-tsup.ts` — library build defaults
- `tooling/package-vitest.ts` — test defaults

## Docs

- Brand & architecture: `docs/brand.md`, `docs/kenos/`
- Future evolution plans: `docs/datepicker/`, `docs/select/`
- Layout target: `docs/package-structure.md`
- Popup behavior: `docs/popup-policy.md`

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

### Quick reference

| Step | Command |
|------|---------|
| Add changeset | `pnpm changeset` |
| Apply versions | `pnpm changeset version` |
| Build packages | `pnpm turbo build --filter=./packages/*` |
| Publish | `pnpm changeset publish` |
| Build + publish | `pnpm release` |