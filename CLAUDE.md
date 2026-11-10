# CLAUDE.md — shanu-design-system

Internal design system monorepo built on MUI. Packages are published as `@shanu/*` scoped modules.

## Monorepo structure

```
shanu-design-system/
├── packages/
│   ├── tokens/       # @shanu/tokens — raw design tokens
│   ├── theme/        # @shanu/theme  — MUI theme built from tokens
│   ├── components/   # @shanu/components — React components
│   └── hooks/        # @shanu/hooks  — shared React hooks
├── apps/
│   └── storybook/    # @shanu/storybook — visual playground
├── package.json      # root workspace
└── pnpm-workspace.yaml
```

Dependency chain: `tokens → theme → components`. Never import downstream packages from upstream ones.

## Prerequisites

- Node.js >= 26
- pnpm >= 12 (enable via `corepack enable`)

## Common commands

| Command                | What it does                           |
| ---------------------- | -------------------------------------- |
| `pnpm install`         | Install all workspace dependencies     |
| `pnpm build`           | Build all packages (topological order) |
| `pnpm dev`             | Watch-build all packages in parallel   |
| `pnpm typecheck`       | Type-check all packages and apps       |
| `pnpm lint`            | Lint entire repo                       |
| `pnpm lint:fix`        | Lint and auto-fix                      |
| `pnpm format`          | Prettier-format everything             |
| `pnpm format:check`    | Check formatting without writing       |
| `pnpm test`            | Run Vitest across all packages         |
| `pnpm clean`           | Remove all `dist/` outputs             |
| `pnpm storybook:build` | Build the Storybook static site        |

To run a command in a single package: `pnpm --filter @shanu/<pkg> <script>`.

## Toolchain

- **Task runner**: Turborepo (`turbo.json`), local cache only in `.turbo/` (gitignored). `build`, `typecheck`, `test` depend on `^build`. Bypass cache with `--force`; inspect with `pnpm turbo run <task> --dry`. `apps/storybook/turbo.json` adds component/theme sources as build inputs. Remote caching is not configured yet.
- **Build**: Vite + `vite-plugin-dts` (ESM-only output under `dist/`)
- **Tests**: Vitest + `@testing-library/react` + jsdom
- **Lint**: ESLint 10 with `typescript-eslint` + `eslint-config-prettier`
- **Format**: Prettier 3
- **Git hooks**: Husky + lint-staged (runs ESLint + Prettier on staged files)
- **Storybook**: colocated `*.stories.tsx` files inside `packages/components/src/`

## Code conventions

- All packages are ESM (`"type": "module"`). Do not use `require()` or CommonJS patterns.
- Each package exports a single entry point via `exports["."]`; do not add deep import paths without updating `package.json`.
- React peer dependency is `>=18`; dev dependency targets React 19. Write components and hooks compatible with both.
- Prefer named exports over default exports.
- Tests live alongside source files (`*.test.tsx` / `*.test.ts`), not in a separate `__tests__` folder.
- Stories live alongside source files (`*.stories.tsx`).

## Working on packages

When adding or changing a component:

1. Edit source in `packages/components/src/`.
2. Export from `packages/components/src/index.ts`.
3. Add or update the colocated Vitest test.
4. Add or update the colocated Storybook story.
5. Run `pnpm --filter @shanu/components typecheck` and `pnpm --filter @shanu/components test` before committing.

When changing tokens or theme:

- Token changes may cascade to theme and components — run `pnpm build` and `pnpm typecheck` from the root after any token edit.

## Git workflow

- Branch off `master`; open PRs back to `master`.
- Commits run lint-staged automatically (ESLint + Prettier on staged files).
- Keep commits focused; squash fixup commits before merging.
