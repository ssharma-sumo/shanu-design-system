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

- Node.js >= 20
- pnpm 9 (enabled via Corepack: `corepack enable`)

## Setup

```bash
pnpm install
```

## Scripts

| Command | Description |
|---|---|
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | Lint all packages |
| `pnpm clean` | Clean package build outputs |

## Phases

1. **Workspace scaffold** (current) — pnpm monorepo layout
2. Token foundation — Style Dictionary + JS/SCSS/CSS outputs
3. Theme layer — MUI theme from tokens
4. Core components
5. Hooks
6. Storybook + visual QA
