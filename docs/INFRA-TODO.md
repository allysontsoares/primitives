# Kairo — Infrastructure TODO

Checklist de migração e setup do monorepo de primitives.
Referência completa: `docs/INFRA-PLAN.md`

---

## Fase 1 — Renomear repositório e criar monorepo

- [ ] Renomear pasta local: `mv ~/dev/date-picker ~/dev/primitives`
- [ ] Renomear repo no GitHub: Settings → Rename → `primitives`
- [ ] Criar `pnpm-workspace.yaml` na raiz
- [ ] Criar `turbo.json` na raiz
- [ ] Criar `package.json` raiz (workspace root, `private: true`)
- [ ] Criar `tsconfig.base.json` compartilhado na raiz
- [ ] Criar `.gitignore` atualizado (cobrir `dist/`, `.next/`, `.turbo/`, `storybook-static/`)
- [ ] Instalar Turborepo: `pnpm add -D -w turbo`

---

## Fase 2 — Migrar `@at5/kairo` para `packages/kairo`

- [ ] Criar pasta `packages/kairo/`
- [ ] Mover `src/` → `packages/kairo/src/`
- [ ] Mover `tests/` → `packages/kairo/tests/`
- [ ] Mover `tsup.config.ts` → `packages/kairo/tsup.config.ts`
- [ ] Criar `packages/kairo/package.json` com:
  - [ ] `name: "@at5/kairo"`
  - [ ] `publishConfig.access: "public"`
  - [ ] `publishConfig.provenance: true`
  - [ ] `files: ["dist", "README.md", "CHANGELOG.md"]`
  - [ ] `engines: { node: ">=22" }`
  - [ ] peer deps: `react >= 19`, `react-dom >= 19`
- [ ] Criar `packages/kairo/tsconfig.json` extendendo `../../tsconfig.base.json`
- [ ] Criar `packages/kairo/vitest.config.ts`
- [ ] Atualizar scripts do `packages/kairo/package.json` para funcionar via turbo
- [ ] Confirmar que `pnpm test` e `pnpm build` passam dentro de `packages/kairo/`

---

## Fase 3 — Atualizar dependências

- [ ] TypeScript: atualizar para `6.x`
- [ ] React: atualizar peer dep para `>=19.0.0`
- [ ] Vitest: atualizar para `4.x`
- [ ] `@vitest/coverage-v8`: atualizar para `4.x`
- [ ] `@testing-library/react`: verificar compatibilidade com React 19
- [ ] Storybook: manter versão atual (será removido gradualmente)
- [ ] Verificar que todos os 147 testes passam após atualizações

---

## Fase 4 — Tooling: Oxlint + oxfmt + Changesets

- [ ] Instalar Oxlint: `pnpm add -D -w oxlint`
- [ ] Criar `oxlint.json` na raiz
- [ ] Instalar oxfmt
- [ ] Criar configuração do oxfmt na raiz
- [ ] Remover ESLint e Prettier dos devDependencies (root e packages)
- [ ] Instalar Changesets: `pnpm add -D -w @changesets/cli`
- [ ] Inicializar Changesets: `pnpm changeset init`
- [ ] Configurar `.changeset/config.json` (`access: "public"`, `baseBranch: "main"`)
- [ ] Testar `pnpm lint` e `pnpm format:check` na raiz

---

## Fase 5 — apps/playground (Vite 8)

- [ ] Criar `apps/playground/`
- [ ] Inicializar projeto Vite 8 + React 19 + TypeScript 6
- [ ] Adicionar Tailwind CSS 4
- [ ] Referenciar `@at5/kairo` como dependência workspace (`workspace:*`)
- [ ] Criar exemplos básicos:
  - [ ] Single date picker
  - [ ] Range picker
  - [ ] Multiple picker
  - [ ] Locales (pt-BR, en-US, ar RTL)
- [ ] Migrar stories mais úteis do Storybook para o playground
- [ ] Confirmar `pnpm dev` funciona via turbo

---

## Fase 6 — apps/web (Next.js 15 + Tailwind 4)

- [ ] Criar `apps/web/`
- [ ] Inicializar Next.js 15 com App Router + TypeScript 6
- [ ] Instalar Tailwind CSS 4
- [ ] Configurar MDX (`@next/mdx`, `remark-gfm`)
- [ ] Criar estrutura de rotas:
  - [ ] `/` — landing page do Kairo
  - [ ] `/primitives/kairo` — getting started
  - [ ] `/primitives/kairo/api` — API reference
  - [ ] `/primitives/kairo/examples` — exemplos interativos
  - [ ] `/primitives/kairo/changelog` — changelog renderizado
- [ ] Criar componente de live preview para exemplos de código
- [ ] Criar componente de navegação lateral (sidebar)
- [ ] Criar layout responsivo base
- [ ] Configurar dark mode
- [ ] Criar landing page com:
  - [ ] Hero section
  - [ ] Feature highlights (headless, acessível, typescript, i18n)
  - [ ] Demo interativo do date picker
  - [ ] Quick install snippet
  - [ ] Link para docs
- [ ] Configurar deploy na Vercel:
  - [ ] Criar conta Vercel (se não tiver)
  - [ ] Importar repositório
  - [ ] Definir root directory como `apps/web`
  - [ ] Configurar domínio
- [ ] Confirmar `pnpm build` e `pnpm dev` funcionam via turbo

---

## Fase 7 — Exemplos MDX de integração

- [ ] Criar `examples/rhf-zod.mdx`:
  - [ ] Formulário com campo de data obrigatório
  - [ ] Validação com Zod schema
  - [ ] Mensagens de erro acessíveis
  - [ ] Integrar no `/primitives/kairo/examples`
- [ ] Criar `examples/tanstack-form-zod.mdx`:
  - [ ] Mesmo caso de uso com TanStack Form
  - [ ] Integrar no `/primitives/kairo/examples`

---

## Fase 8 — CI/CD: GitHub Actions

- [ ] Criar `.github/workflows/ci.yml`:
  - [ ] Job: lint (`oxlint`)
  - [ ] Job: format check (`oxfmt --check`)
  - [ ] Job: typecheck (`tsc --noEmit`)
  - [ ] Job: test (`vitest run`)
  - [ ] Job: build (todos os packages)
- [ ] Criar `.github/workflows/release.yml`:
  - [ ] Usar `changesets/action`
  - [ ] Configurar `NPM_CONFIG_PROVENANCE: true`
- [ ] Testar CI numa branch de teste antes de merge para main

---

## Fase 9 — Publicação no npm

- [ ] Criar conta em [npmjs.com](https://www.npmjs.com)
- [ ] Ativar 2FA na conta npm
- [ ] Criar organização `@at5` no npm (Account → Add Organization)
- [ ] Fazer login local: `npm login`
- [ ] Verificar login: `npm whoami`
- [ ] Fazer dry-run: `cd packages/kairo && npm publish --dry-run`
- [ ] Revisar output do dry-run — confirmar que apenas `dist/` e docs vão
- [ ] Gerar NPM_TOKEN (Granular Access Token no npm)
- [ ] Adicionar `NPM_TOKEN` nos secrets do GitHub Actions
- [ ] Criar primeiro changeset: `pnpm changeset`
- [ ] Fazer build final: `pnpm build --filter=@at5/kairo`
- [ ] Publicar: `pnpm release` (ou via GitHub Actions)
- [ ] Verificar pacote em `npmjs.com/package/@at5/kairo`
- [ ] Testar instalação: `npm install @at5/kairo` em projeto separado

---

## Fase 10 — Migração gradual do Storybook

> Fazer em paralelo com a construção de `apps/web`, story por story.

- [ ] Mapear as 14 stories existentes para seções do site
- [ ] Migrar cada story para MDX live preview no site:
  - [ ] Single — Default
  - [ ] Single — Controlled
  - [ ] Single — Min/Max
  - [ ] Single — Disabled Weekends
  - [ ] Single — Inline
  - [ ] Single — Read Only
  - [ ] Single — Force Mount Animation
  - [ ] Single — Floating Positions
  - [ ] Range
  - [ ] Multiple
  - [ ] Locales (en-US, en-GB, fr-FR, ar RTL, ja-JP, pt-BR)
- [ ] Após todas as stories cobertas: remover Storybook
  - [ ] Remover `@storybook/*` dos devDependencies
  - [ ] Remover `.storybook/`
  - [ ] Remover `storybook-static/` do `.gitignore`
  - [ ] Remover scripts do Storybook

---

## Fase 11 — Playwright (segunda fase)

- [ ] Instalar `@vitest/browser` e `playwright`
- [ ] Criar `packages/kairo/vitest.config.browser.ts`
- [ ] Configurar browser instances: Chromium, Firefox, WebKit
- [ ] Migrar testes de keyboard navigation para rodar em browser real
- [ ] Adicionar job `test:browser` no CI
- [ ] Configurar screenshots de regressão visual (opcional)

---

## Backlog — Futuro

- [ ] Segundo primitive (select, dialog, ou outro)
- [ ] `apps/web` evolui landing para apresentar ecossistema completo
- [ ] Serif UI (repositório separado) — camada estilizada sobre os primitives
- [ ] `@at5/kairo-calendar` — standalone calendar (possível split)
- [ ] Domínio definitivo (`kairojs.dev` ou similar)
- [ ] Benchmarks de performance (bundle size tracking)
- [ ] Documentação em português e inglês

---

## Ordem de prioridade

```
Fase 1  → Fase 2  → Fase 3   (monorepo + migração + deps)     ~3 dias
Fase 4                        (oxlint + oxfmt + changesets)    ~1 dia
Fase 5                        (playground Vite 8)              ~2 dias
Fase 6  → Fase 7              (site Next.js + exemplos MDX)    ~1–2 semanas
Fase 8  → Fase 9              (CI/CD + primeiro publish npm)   ~2 dias
Fase 10                       (migração Storybook — contínuo)
Fase 11                       (Playwright — segunda fase)
```
