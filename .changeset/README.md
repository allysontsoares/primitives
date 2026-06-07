# Changesets

Kenos UI uses [Changesets](https://github.com/changesets/changesets) for **independent** multi-package versioning. Each publishable `@kenos-ui/*` package gets its own semver line and `CHANGELOG.md`.

## Versioning policy

| Package | Policy |
|---------|--------|
| `@kenos-ui/react-datepicker` | Independent — primitive releases on its own cadence |
| `@kenos-ui/react` | Independent — aggregator bumps when you choose; workspace dep bumps trigger a patch via `updateInternalDependencies` |
| Internal apps (`@kenos-ui/web`, `@kenos-ui/playground`, `@kenos-ui/storybook`) | Ignored — not published |

**No fixed or linked groups.** `@kenos-ui/react` and `@kenos-ui/react-datepicker` are **not** locked to the same version; the aggregator may trail or lead the primitive depending on release timing.

## Release workflow

1. `pnpm changeset` — describe your change; select affected packages and bump type (patch/minor/major).
2. Merge the generated `.changeset/*.md` file(s) with your PR.
3. On release: `pnpm version` (runs `changeset version`) then `pnpm release` (build + `changeset publish`).

See [CONTRIBUTING.md](../CONTRIBUTING.md#releases) for the full contributor guide.

## Common questions

- [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
- [Adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)