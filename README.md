# shanu-design-system

Internal design system built on MUI — packages for tokens, theme, components, and hooks.

## Structure

```
shanu-design-system/
├── packages/
│   ├── tokens/       # @shanu/tokens
│   ├── theme/        # @shanu/theme
│   ├── components/   # @shanu/components
│   └── hooks/        # @shanu/hooks
├── apps/
│   └── storybook/    # @shanu/storybook
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js >= 26
- pnpm 11 (enabled via Corepack: `corepack enable`)

## Setup

```bash
pnpm install
```

## Scripts

| Command          | Description                 |
| ---------------- | --------------------------- |
| `pnpm build`     | Build all packages          |
| `pnpm typecheck` | Type-check all packages     |
| `pnpm lint`      | Lint all packages           |
| `pnpm clean`     | Clean package build outputs |

`build`, `typecheck` and `test` run through [Turborepo](https://turborepo.dev) with local caching (cache stored in `.turbo/`). Re-running an unchanged task replays from cache; use `pnpm build --force` to bypass it.

## Phases

1. **Workspace scaffold** (current) — pnpm monorepo layout
2. Token foundation — Style Dictionary + JS/SCSS/CSS outputs
3. Theme layer — MUI theme from tokens
4. Core components
5. Hooks
6. Storybook + visual QA
