# Kairo — Infrastructure TODO

Checklist de migração e setup do monorepo de primitives.
Referência completa: `docs/INFRA-PLAN.md`

> **Status revisado em 2026-05-29.** Itens marcados `[x]` foram verificados no
> repositório (build, test, typecheck, lint e format:check rodando verdes).
> Notas `→` registram onde a implementação divergiu (geralmente para melhor) do
> plano original.

---

## Fase 1 — Renomear repositório e criar monorepo ✅

- [x] Renomear pasta local: `mv ~/dev/date-picker ~/dev/primitives`
- [x] Renomear repo no GitHub: Settings → Rename → `primitives`
- [x] Criar `pnpm-workspace.yaml` na raiz
- [x] Criar `turbo.json` na raiz → inclui `storybook-static/**` nos outputs do build
- [x] Criar `package.json` raiz (workspace root, `private: true`)
- [x] Criar `tsconfig.base.json` compartilhado na raiz
- [x] Criar `.gitignore` atualizado (cobre `dist/`, `.next/`, `.turbo/`, `storybook-static/`)
- [x] Instalar Turborepo: `pnpm add -D -w turbo`

---

## Fase 2 — Migrar `@at5/kairo` para `packages/kairo` ✅

- [x] Criar pasta `packages/kairo/`
- [x] Mover `src/` → `packages/kairo/src/`
- [x] Mover `tests/` → `packages/kairo/tests/`
- [x] Mover `tsup.config.ts` → `packages/kairo/tsup.config.ts`
- [x] Criar `packages/kairo/package.json` com:
  - [x] `name: "@at5/kairo"`
  - [x] `publishConfig.access: "public"`
  - [x] `publishConfig.provenance: true`
  - [x] `files: ["dist", "README.md", "CHANGELOG.md"]`
  - [x] `engines: { node: ">=22" }`
  - [x] peer deps: `react >= 19`, `react-dom >= 19`
- [x] Criar `packages/kairo/tsconfig.json` extendendo `../../tsconfig.base.json`
- [x] Criar `packages/kairo/vitest.config.ts`
- [x] Atualizar scripts do `packages/kairo/package.json` para funcionar via turbo
- [x] Confirmar que `pnpm test` e `pnpm build` passam dentro de `packages/kairo/`
- [ ] Criar `packages/kairo/README.md` e `CHANGELOG.md` → referenciados em `files`
      mas ainda ausentes (gera warning no `npm publish`; o changeset cria o
      CHANGELOG no primeiro release)

---

## Fase 3 — Atualizar dependências ✅

- [x] TypeScript: atualizar para `6.x`
- [x] React: atualizar peer dep para `>=19.0.0`
- [x] Vitest: atualizar para `4.x` (rodando 4.1.7)
- [x] `@vitest/coverage-v8`: atualizar para `4.x`
- [x] `@testing-library/react`: verificar compatibilidade com React 19 (v16)
- [x] Storybook: manter versão atual (8.6.18 — será removido gradualmente)
- [x] Verificar que todos os 147 testes passam após atualizações
      → corrigido bug que travava 22 testes: `Content` usava `visibility: hidden`
      até o Floating UI posicionar, removendo o dialog da árvore de
      acessibilidade. Trocado por `opacity: 0 + pointer-events: none`
      (esconde o "fly-in" igual, mas mantém o dialog acessível)

---

## Fase 4 — Tooling: Oxlint + oxfmt + Changesets ✅

- [x] Instalar Oxlint: `pnpm add -D -w oxlint`
- [x] Criar `oxlint.json` na raiz → `.oxlintrc.json` (plugins react/hooks/ts/unicorn/oxc)
- [x] Instalar oxfmt
- [x] Criar configuração do oxfmt na raiz → `.oxfmtrc.json`
- [x] Remover ESLint e Prettier dos devDependencies (root e packages) — nenhum vestígio
- [x] Instalar Changesets: `pnpm add -D -w @changesets/cli`
- [x] Inicializar Changesets: `pnpm changeset init`
- [x] Configurar `.changeset/config.json` (`access: "public"`, `baseBranch: "main"`)
- [x] Testar `pnpm lint` e `pnpm format:check` na raiz (ambos verdes — 0 erros de lint)
      → adicionado `**/next-env.d.ts` ao ignore do oxlint (arquivo gerado pelo Next)

---

## Fase 5 — apps/playground (Vite 8) ✅ (parcial)

- [x] Criar `apps/playground/`
- [x] Inicializar projeto Vite 8 + React 19 + TypeScript 6
- [x] Adicionar Tailwind CSS 4 (`@tailwindcss/vite`)
- [x] Referenciar `@at5/kairo` como dependência workspace (`workspace:*`)
- [ ] Criar exemplos básicos:
  - [x] Single date picker (App.tsx + components/Calendar, Field)
  - [ ] Range picker
  - [ ] Multiple picker
  - [ ] Locales (pt-BR, en-US, ar RTL)
- [ ] Migrar stories mais úteis do Storybook para o playground
- [x] Confirmar `pnpm dev` funciona via turbo (build do playground passa)

---

## Fase 6 — apps/web (Next.js 15 + Tailwind 4) ✅ (parcial)

> **Desvio de rotas:** o site usa `/docs/...` em vez de `/primitives/kairo/...`.
> Faz sentido enquanto há um único primitive; reavaliar ao adicionar o segundo.

- [x] Criar `apps/web/`
- [x] Inicializar Next.js 15 com App Router + TypeScript 6 (turbopack no dev)
- [x] Instalar Tailwind CSS 4 (`@tailwindcss/postcss`)
- [x] Configurar MDX → usa `next-mdx-remote` (conteúdo em `src/content/docs/*.mdx`)
- [x] Criar estrutura de rotas (sob `/docs`):
  - [x] `/` — landing page do Kairo
  - [x] `/docs` + `/docs/getting-started` — getting started
  - [x] `/docs/api` — API reference
  - [x] `/docs/examples` — exemplos interativos
  - [x] `/docs/changelog` — changelog renderizado
- [x] Criar componente de live preview para exemplos (`LivePreview.tsx`)
- [x] Criar componente de navegação lateral (`DocsNav`, `MobileNav`, `TableOfContents`)
- [x] Criar layout responsivo base (`docs/layout.tsx`, `SiteHeader`)
- [x] Configurar dark mode (globals.css)
- [x] Criar landing page (hero, features, demo `DemoDatePicker`, install, links)
- [ ] Configurar deploy na Vercel (conta, importar repo, root `apps/web`, domínio)
- [x] Confirmar `pnpm build` e `pnpm dev` funcionam via turbo (build estático OK)

---

## Fase 7 — Exemplos MDX de integração ✅

> **Desvio:** os exemplos não ficam no diretório raiz `examples/` (que está vazio),
> e sim co-localizados no site em `apps/web/src/content/docs/examples/`. Abordagem
> melhor — vivem junto da página que os renderiza. O glob `examples/*` no
> `pnpm-workspace.yaml` pode ser removido enquanto o diretório estiver vazio.

- [x] `react-hook-form.mdx` + `InteractiveRHFForm.tsx`:
  - [x] Formulário com campo de data obrigatório
  - [x] Validação com Zod schema (`@hookform/resolvers`, `zod`)
  - [x] Mensagens de erro acessíveis
  - [x] Integrado em `/docs/examples/react-hook-form`
- [x] `tanstack-form.mdx` + `InteractiveTanStackForm.tsx`:
  - [x] Mesmo caso de uso com TanStack Form
  - [x] Integrado em `/docs/examples/tanstack-form`

---

## Fase 8 — CI/CD: GitHub Actions ✅

- [x] Criar `.github/workflows/ci.yml`:
  - [x] Job: lint (`pnpm lint` → oxlint)
  - [x] Job: format check (`pnpm format:check` → oxfmt)
  - [x] Job: typecheck (`pnpm typecheck`)
  - [x] Job: test (`pnpm test`)
  - [x] Job: build (todos os packages)
- [x] Criar `.github/workflows/release.yml`:
  - [x] Usar `changesets/action`
  - [x] Configurar `NPM_CONFIG_PROVENANCE: true`
  - [x] → adicionado bloco `permissions` (contents/pull-requests/id-token write),
        exigido para o action abrir PR de versão e para a provenance via OIDC
- [ ] Testar CI numa branch de teste antes de merge para main (requer push remoto)

---

## Fase 9 — Publicação no npm ⏳

- [x] Criar conta em [npmjs.com](https://www.npmjs.com)
- [ ] Ativar 2FA na conta npm
- [x] Criar organização `@at5` no npm (Account → Add Organization)
- [x] Fazer login local: `npm login`
- [x] Verificar login: `npm whoami`
- [x] Fazer dry-run: `cd packages/kairo && npm publish --dry-run`
- [ ] Revisar output do dry-run — confirmar que apenas `dist/` e docs vão
- [ ] Gerar NPM_TOKEN (Granular Access Token no npm)
- [ ] Adicionar `NPM_TOKEN` nos secrets do GitHub Actions
- [ ] Criar primeiro changeset: `pnpm changeset`
- [ ] Fazer build final: `pnpm build --filter=@at5/kairo`
- [ ] Publicar: `pnpm release` (ou via GitHub Actions)
- [ ] Verificar pacote em `npmjs.com/package/@at5/kairo`
- [ ] Testar instalação: `npm install @at5/kairo` em projeto separado

---

## Fase 10 — Migração gradual do Storybook ⏳

> Storybook 8.6.18 ainda presente em `packages/kairo/.storybook` com 4 arquivos de
> stories (single, range, multiple, locales) cobrindo as ~14 variações.
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

## Fase 11 — Playwright (segunda fase) ⏳

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

## O que realmente falta (resumo)

1. **Fase 9 — Publicação no npm**: nada feito; exige conta/org `@at5`, 2FA,
   `NPM_TOKEN` no GitHub e o primeiro changeset/release.
2. **Deploy na Vercel** (Fase 6): site pronto e buildando, falta importar na Vercel.
3. **Playground** (Fase 5): só o exemplo single; faltam range, multiple e locales.
4. **Storybook** (Fase 10): migração para MDX no site ainda não começou.
5. **Playwright** (Fase 11): não iniciado.
6. **Higiene de publish**: README/CHANGELOG dentro de `packages/kairo`.
7. **Validar CI remoto**: workflows criados, mas ainda não exercitados num push/PR.

---

## Ordem de prioridade

```
Fase 1  → Fase 2  → Fase 3   (monorepo + migração + deps)     ✅ concluído
Fase 4                        (oxlint + oxfmt + changesets)    ✅ concluído
Fase 5                        (playground Vite 8)              ⏳ parcial
Fase 6  → Fase 7              (site Next.js + exemplos MDX)    ✅ site/exemplos; falta deploy
Fase 8  → Fase 9              (CI/CD + primeiro publish npm)   ✅ CI/CD; ⏳ publish
Fase 10                       (migração Storybook — contínuo)  ⏳
Fase 11                       (Playwright — segunda fase)      ⏳
```

</content>
