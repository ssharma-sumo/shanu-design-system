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

## Claude agents and skills

Project-level Claude Code config lives in `.claude/` (checked in, shared with the team).

| Name            | Type  | Location                            | Purpose                                                                                                  |
| --------------- | ----- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `pr-reviewer`   | Agent | `.claude/agents/pr-reviewer.md`     | Read-only review of branch/PR changes vs `master`: correctness, repo conventions, missing tests/stories. |
| `a11y-reviewer` | Agent | `.claude/agents/a11y-reviewer.md`   | Read-only WCAG 2.1 AA review: semantics, names, keyboard/focus, ARIA, contrast, reduced motion.          |
| `/review-pr`    | Skill | `.claude/skills/review-pr/SKILL.md` | Runs both agents in parallel and merges results into one report (accepts an optional PR number).         |

Notes:

- Use `/review-pr [PR#]` for a full review before opening or merging a PR. Use an agent alone when you only need that one perspective.
- Subagents cannot spawn other subagents, so `pr-reviewer` does not call `a11y-reviewer` itself; the `/review-pr` skill orchestrates both.
- The reviewers are read-only: they report findings and never edit files, commit, or push.
- When adding a new agent or skill, add it to the table above.

## Git workflow

- Branch off `master`; open PRs back to `master`.
- Commits run lint-staged automatically (ESLint + Prettier on staged files).
- Keep commits focused; squash fixup commits before merging.
