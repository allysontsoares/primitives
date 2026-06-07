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