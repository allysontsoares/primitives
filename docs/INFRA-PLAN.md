# Kairo — Infrastructure & Architecture Plan

## Visão

Kairo não é "mais um date picker". É o início de um ecossistema de
**headless date & scheduling primitives** — focado em:

- Calendários e seletores de data acessíveis
- Range, múltipla seleção, timezone-safe UX
- Booking e scheduling patterns
- Integração fluida com form libraries (RHF, TanStack Form)

O modelo de negócio/open source é idêntico ao da dupla Radix + shadcn:

```
@at5/kairo (primitives)  →  Serif UI (camada estilizada, repo separado)
Radix UI               →  shadcn/ui
Base UI                →  [sem equivalente oficial ainda]
Ark UI                 →  Park UI
```

---

## 1. Repositório

### Ação

Renomear o repositório atual `date-picker` para `primitives`.

- Localmente: `mv ~/dev/date-picker ~/dev/primitives`
- GitHub: Settings → Rename → `primitives`

O histórico git é preservado integralmente — os 13 phases de desenvolvimento
do Kairo permanecem acessíveis.

### Por quê "primitives"?

- Descreve exatamente o que o repo contém
- Escala para qualquer componente futuro (`kairo`, `select`, `dialog`, etc.)
- Não amarra ao branding da empresa nem ao nome de nenhum primitive específico

---

## 2. Estrutura do Monorepo

```
primitives/
├── packages/
│   └── kairo/                   # @at5/kairo — headless date picker
│       ├── src/
│       ├── tests/
│       ├── package.json
│       ├── tsup.config.ts
│       └── tsconfig.json
│
├── apps/
│   ├── web/                     # Next.js 15 — landing page + docs + exemplos
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx               # landing page
│   │   │   │   └── primitives/
│   │   │   │       └── kairo/
│   │   │   │           ├── page.mdx       # getting started
│   │   │   │           ├── api/
│   │   │   │           │   └── page.mdx
│   │   │   │           └── examples/
│   │   │   │               └── page.mdx
│   │   │   └── components/
│   │   └── package.json
│   │
│   └── playground/              # Vite 8 — scratchpad de desenvolvimento
│       ├── src/
│       └── package.json
│
├── examples/                    # Exemplos MDX de integração
│   ├── rhf-zod.mdx              # React Hook Form + Zod
│   └── tanstack-form-zod.mdx    # TanStack Form + Zod
│
├── .changeset/                  # Changesets config
├── .github/
│   └── workflows/
│       ├── ci.yml               # lint, typecheck, test, build
│       └── release.yml          # changesets publish
├── turbo.json
├── pnpm-workspace.yaml
├── package.json                 # root workspace
├── oxlint.json
├── .oxfmt.toml                  # ou configuração equivalente do oxfmt
└── tsconfig.base.json           # tsconfig compartilhado
```

---

## 3. Stack de Dependências

### Versões definidas

| Tecnologia   | Versão              | Onde                        |
| ------------ | ------------------- | --------------------------- |
| Node.js      | `>=22`              | engines (todos os packages) |
| pnpm         | `10+`               | packageManager              |
| TypeScript   | `6.x`               | todos os packages           |
| React        | `19.x`              | peer dep + apps             |
| Vite         | `8.x`               | playground + tsup internals |
| Vitest       | `4.x`               | todos os packages           |
| Tailwind CSS | `4.x`               | web + playground            |
| Next.js      | `15.x` (App Router) | apps/web                    |
| tsup         | `latest`            | packages/kairo build        |
| Turborepo    | `2.x`               | root                        |
| Changesets   | `latest`            | root                        |
| Oxlint       | `latest`            | root                        |
| oxfmt        | `latest`            | root                        |

### `packages/kairo` — dependências de runtime

```json
{
  "dependencies": {
    "timescape": "^0.8.0",
    "@floating-ui/react-dom": "^2.1.8"
  },
  "peerDependencies": {
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0"
  }
}
```

---

## 4. Monorepo — Turborepo

### `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
  - "apps/*"
  - "examples/*"
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

### Scripts raiz (`package.json`)

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "lint": "oxlint .",
    "format": "oxfmt .",
    "format:check": "oxfmt --check .",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "turbo run build --filter=./packages/* && changeset publish"
  }
}
```

---

## 5. Build — `packages/kairo`

Mantém **tsup** — é exatamente o que o projeto precisa para uma lib.

### `tsup.config.ts`

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  treeshake: true,
  splitting: false,
});
```

### `package.json` de `packages/kairo`

```json
{
  "name": "@at5/kairo",
  "version": "0.1.0",
  "description": "Headless date & scheduling primitives for React",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md", "CHANGELOG.md"],
  "sideEffects": false,
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

---

## 6. Testing

### Fase 1 — Vitest 4 (migração imediata)

Configuração por package. `packages/kairo/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["**/*.stories.*", "tests/**", "dist/**"],
    },
  },
});
```

### Fase 2 — Playwright (segunda fase, após migração)

Browser testing real com Chromium/Firefox/WebKit. Vitest tem integração
nativa com Playwright via `@vitest/browser`. Quando implementar:

```typescript
// vitest.config.browser.ts
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
    },
  },
});
```

---

## 7. Qualidade de Código — Oxlint + oxfmt

### `oxlint.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",
  "rules": {
    "correctness": "error",
    "suspicious": "warn",
    "perf": "warn"
  },
  "ignore": ["**/dist/**", "**/node_modules/**", "**/.next/**"]
}
```

### `.oxfmt.toml` (ou equivalente)

Configuração mínima — oxfmt tem opinionated defaults adequados.

### Por que não ESLint + Prettier?

- Oxlint: 50–100x mais rápido que ESLint em Rust
- oxfmt: nativo do ecossistema Oxc, mesma filosofia
- Menos configuração para manter
- Feedback mais rápido no CI

---

## 8. Storybook — Migração Gradual

O projeto tem 14 stories valiosas cobrindo edge cases (RTL, range, locales,
múltipla seleção). Não serão deletadas imediatamente.

### Estratégia

1. Ao construir cada seção de docs interativas em `apps/web/`, migrar as
   stories equivalentes para MDX + live preview
2. Remover a story correspondente após a migration estar estável
3. Quando todas as 14 stories estiverem cobertas, remover Storybook do
   monorepo

### Por que gradual?

Evita perder cobertura de comportamento — as stories documentam casos que
seriam fáceis de esquecer (ex: foco no segmented input durante mudança de mês).

---

## 9. Site — `apps/web`

### Stack

- **Next.js 15** com App Router
- **Tailwind CSS 4**
- **MDX** para conteúdo das docs
- **Vercel** para deploy (free tier)

### Estrutura de rotas

```
/                              → landing page do Kairo
/primitives/kairo              → getting started
/primitives/kairo/api          → API reference completa
/primitives/kairo/examples     → exemplos interativos (RHF, TanStack Form)
/primitives/kairo/changelog    → CHANGELOG.md renderizado
```

Quando chegar o próximo primitive:

```
/primitives/[nome]             → docs do novo primitive
/                              → evolui para apresentar o ecossistema
```

### Inspiração visual

Base UI docs — clean, sem ornamentos, foco no conteúdo e exemplos interativos.
Prioridade: live preview real, copy/paste funcional, dark mode.

### Domínio

Considerar `kairojs.dev` ou `kairo.dev` — TLD `.dev` tem mais alcance
internacional que `.com.br` para uma lib npm. `kairo.at5.dev.br` funciona
para começar enquanto o domínio definitivo não é contratado.

---

## 10. Exemplos — MDX

Exemplos de integração ficam em `examples/` como arquivos MDX e são
importados/renderizados no site de docs. Não são projetos separados — são
snippets completos e funcionais embutidos na documentação.

### Exemplos planejados para `@at5/kairo`

**`examples/rhf-zod.mdx`** — React Hook Form + Zod

- Formulário com campo de data obrigatório
- Validação de range de datas
- Mensagens de erro acessíveis

**`examples/tanstack-form-zod.mdx`** — TanStack Form + Zod

- Mesmo caso de uso, API diferente
- Demonstra que o Kairo é agnóstico de form library

---

## 11. CI/CD — GitHub Actions

### `.github/workflows/ci.yml`

Roda em todo push e PR para `main`.

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

### `.github/workflows/release.yml`

Roda em push para `main` — abre PR de versioning ou publica.

```yaml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: "https://registry.npmjs.org"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          NPM_CONFIG_PROVENANCE: true
```

---

## 12. Publicação no npm — Guia Completo

Esta seção é um passo a passo para quem nunca publicou no npm.

### Passo 1 — Criar conta no npm

1. Acesse [npmjs.com](https://www.npmjs.com) e crie uma conta
2. Verifique o email
3. **Ative 2FA obrigatoriamente** — o npm exige para publicar pacotes com escopo
   - Recomendo usar um app autenticador (Google Authenticator, Authy, 1Password)

### Passo 2 — Criar a organização `@at5`

1. No npm, vá em Account → Add Organization
2. Nome: `at5`
3. Plan: **Free** (suficiente para pacotes públicos)
4. Isso cria o namespace `@at5` — todos os seus pacotes podem usar `@at5/nome`

### Passo 3 — Login local

```bash
npm login
# Digite username, password, email, e o código 2FA quando solicitado
```

Verifique:

```bash
npm whoami
# deve retornar seu username
```

### Passo 4 — Configurar o package.json

Confirmar que `packages/kairo/package.json` tem:

```json
{
  "publishConfig": {
    "access": "public",
    "provenance": true
  },
  "files": ["dist", "README.md", "CHANGELOG.md"]
}
```

- `access: public` — obrigatório para pacotes com escopo serem gratuitos
- `provenance: true` — adiciona atestado criptográfico linkando o pacote ao commit do GitHub
- `files` — controla exatamente o que vai para o npm (apenas o necessário)

### Passo 5 — Inicializar Changesets

```bash
pnpm add -D @changesets/cli -w
pnpm changeset init
```

Isso cria `.changeset/config.json`. Edite:

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### Passo 6 — Como funciona o fluxo de release

**Desenvolvimento normal:**

```bash
# Fez mudanças em packages/kairo
pnpm changeset
# CLI pergunta: qual package mudou? patch/minor/major? o que mudou?
# Gera um arquivo .changeset/algum-nome-aleatorio.md
git add .
git commit -m "feat: nova funcionalidade + changeset"
```

**Quando quiser fazer release:**

```bash
# Opção A — manual local
pnpm version        # atualiza package.json + CHANGELOG.md
pnpm release        # faz build + publish no npm

# Opção B — automatizado via GitHub Actions (recomendado)
# Apenas faça merge do PR normalmente.
# O workflow release.yml detecta os .changeset/ e abre um PR "Version Packages".
# Ao fazer merge desse PR, o workflow publica automaticamente no npm.
```

### Passo 7 — NPM_TOKEN para GitHub Actions

1. No npm: Account → Access Tokens → Generate New Token → **Granular Access Token**
2. Configure:
   - Token name: `github-actions-primitives`
   - Expiration: 365 days (renove anualmente)
   - Packages: `@at5/kairo` — Read and write
3. Copie o token gerado (só aparece uma vez)
4. No GitHub: Settings → Secrets and variables → Actions → New repository secret
   - Name: `NPM_TOKEN`
   - Value: cole o token

### Passo 8 — Primeiro publish

Antes do primeiro publish, teste com dry-run:

```bash
cd packages/kairo
npm publish --dry-run
# Mostra exatamente o que seria enviado ao npm sem publicar de fato
```

Se tudo parece certo:

```bash
pnpm release
# ou via workflow do GitHub Actions
```

### Passo 9 — Verificar o pacote publicado

Após publicar:

- `https://www.npmjs.com/package/@at5/kairo` — página do pacote
- Badge de provenance visível se `NPM_CONFIG_PROVENANCE=true` foi usado
- Teste instalação: `npm install @at5/kairo` em um projeto separado

### O que é npm provenance?

É um atestado criptográfico que o npm gera durante a publicação via GitHub
Actions. Ele prova que o pacote veio de um commit específico do repositório
GitHub, não foi alterado, e foi publicado por um workflow legítimo.

Resultado: badge "verified" na página do npm, confiança adicional para quem
instala. Custo: zero — é só a flag `NPM_CONFIG_PROVENANCE: true` no workflow.

---

## 13. `tsconfig.base.json` — Compartilhado

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

Cada package estende:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

---

## Resumo das decisões

| Decisão        | Escolha                  | Motivo                                |
| -------------- | ------------------------ | ------------------------------------- |
| Repo           | `primitives`             | escala para qualquer primitive futuro |
| Monorepo       | pnpm + Turborepo         | simples, caching, integração Vercel   |
| npm org        | `@at5`                   | namespace da empresa, extensível      |
| Build lib      | tsup                     | simples, dual ESM+CJS, dts            |
| Build apps     | Vite 8                   | mais rápido, moderno                  |
| TypeScript     | 6.x                      | última versão estável                 |
| React          | 19.x                     | última versão                         |
| Tests          | Vitest 4                 | nativo Vite, rápido                   |
| Browser tests  | Playwright (fase 2)      | real browser, multi-engine            |
| Lint           | Oxlint                   | Rust, 100x mais rápido                |
| Format         | oxfmt                    | nativo Oxc                            |
| Versionamento  | Changesets               | padrão open source                    |
| npm provenance | sim                      | confiança, custo zero                 |
| CI/CD          | GitHub Actions           | gratuito, integrado                   |
| Site           | Next.js 15 + Tailwind 4  | App Router, MDX, Vercel               |
| Storybook      | migração gradual         | substituído por docs interativas      |
| Domínio        | `kairojs.dev` (sugestão) | TLD internacional                     |
