# Custom Component Library on MUI — Architecture & Delivery Plan

## 1. Goals

- Build an internal design-system package built on top of MUI (Material UI) v7.
- Export three things from the library:
  1. **Components** (React components wrapping/extending MUI)
  2. **Hooks** (reusable logic: theme, media query, form helpers, etc.)
  3. **Design Tokens** — usable from **JS/TS** (for MUI theme + JS consumers) **and SCSS** (for teams/pages not using MUI directly, or plain CSS work)
- Any developer — inside or outside the MUI ecosystem — should be able to build a new component using the *same* tokens and get visual consistency automatically.

---

## 2. High-Level Architecture (Monorepo)

Use a monorepo so tokens, components, and hooks version together and stay in sync.

```
design-system/
├── packages/
│   ├── tokens/            # Source of truth: design tokens (Style Dictionary also include style dictionary config)
│   ├── theme/             # MUI theme built FROM tokens
│   ├── components/        # React components (uses theme + tokens) ( for starter only export few basic component likes button, header, dialog etc )
│   ├── hooks/             # Standalone hooks package
├── apps/
│   └── storybook/         # Docs + visual playground
├── turbo.json / nx.json   # Task orchestration
├── package.json           # workspaces root
└── changeset config       # versioning/publishing
```

**Tooling recommendation:** pnpm workspaces + Turborepo (or Nx)(this can be added later), vite for builds, Changesets for versioning, Storybook for docs, Style Dictionary for tokens.

---

## 3. Design Tokens (the foundation - build this first)

### 3.1 Token layering (industry-standard 3-tier model)

| Tier | Purpose | Example |
|---|---|---|
| **Global/Primitive** | Raw values, no meaning attached | `color.blue.500 = #2563eb`, `spacing.4 = 16px` |
| **Semantic/Alias** | Meaning-based, references primitives | `color.background.primary = {color.blue.500}`, `color.text.danger = {color.red.600}` |
| **Component** | Component-specific overrides | `button.primary.bg = {color.background.primary}` |

This is what makes tokens "semantic" — consumers use `color-text-danger`, not `red-600`, so rebranding = changing one primitive layer.

### 3.2 Source format

Author tokens once, in **JSON** (or the W3C Design Tokens format), e.g.:

```json
// tokens/color.json
{
  "color": {
    "blue": { "500": { "value": "#2563eb" } }
  },
  "semantic": {
    "background": { "primary": { "value": "{color.blue.500}" } },
    "text": { "danger": { "value": "{color.red.600}" } }
  }
}
```

### 3.3 Build pipeline: Style Dictionary

Use **[Style Dictionary](https://amzn.github.io/style-dictionary/)** to transform the single JSON source into multiple platform outputs:

```js
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
        { destination: 'tokens.json', format: 'json/flat' } // for MUI theme consumption
      ]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/scss/',
      files: [
        { destination: '_tokens.scss', format: 'scss/variables' },
        { destination: '_tokens-map.scss', format: 'scss/map-flat' } // enables SCSS functions/loops
      ]
    },
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }] // CSS custom properties, framework-agnostic
    }
  }
};
```

Output result — same values, three consumable formats:

```js
// JS
export const colorTextDanger = "#dc2626";
```
```scss
// SCSS
$color-text-danger: #dc2626;
// or as a map for @use with namespacing
$tokens: ("color-text-danger": #dc2626, ...);
```
```css
:root {
  --color-text-danger: #dc2626;
}
```

This lets a non-MUI team building a custom component do:
```scss
@use '@yourorg/tokens/scss/tokens' as tokens;
.custom-alert { color: tokens.$color-text-danger; }
```
...while a React/MUI dev does:
```ts
import { colorTextDanger } from '@yourorg/tokens/js';
```

### 3.4 Publish tokens as their own package

`@yourorg/tokens` — zero React/MUI dependency, so any stack (Angular, plain HTML, mobile design tools via Tokens Studio) can consume it. This is the package that "should be available for JS and SCSS" per your requirement.

---

## 4. MUI Theme Layer (`@yourorg/theme`)

This package maps semantic tokens → MUI's `createTheme()` shape, so MUI's internal styling engine and your custom components share one source of truth.

```ts
import { createTheme } from '@mui/material/styles';
import * as tokens from '@yourorg/tokens/js';

export const theme = createTheme({
  palette: {
    primary: { main: tokens.colorBackgroundPrimary },
    error: { main: tokens.colorTextDanger }
  },
  spacing: (factor) => `${tokens.spacingUnit * factor}px`,
  typography: {
    fontFamily: tokens.fontFamilyBase,
    h1: { fontSize: tokens.fontSizeHeading1 }
  },
  shape: { borderRadius: tokens.radiusMd },
  // custom design tokens not native to MUI's theme shape:
  customTokens: tokens
});
```
Use TypeScript **module augmentation** to extend MUI's `Theme`/`ThemeOptions` interfaces if you add custom keys (e.g., `customTokens`, custom variants, custom component slots).

---

## 5. Components Package (`@yourorg/components`)

### Structure per component
```
components/src/Button/
├── Button.tsx
├── Button.types.ts
├── Button.styles.ts     # styled() using theme tokens, not hardcoded values
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

### Rules to enforce (via lint rules / PR checklist)
- No hardcoded hex colors, px spacing, or font sizes in component code — always pull from `theme.customTokens` or MUI's `sx`/`styled` referencing theme.
- Wrap/extend MUI primitives rather than reinventing (e.g., `MyButton` composes `@mui/material/Button` with your variants), unless there's a hard functional reason not to — this keeps accessibility and behavior (focus states, ripple, keyboard nav) for free.
- Every component accepts `sx` and forwards `ref` (standard MUI conventions) for composability.
- Export both the component and its prop types.

### Styling approach
Prefer MUI's `styled()`/theme-driven `sx` over raw CSS-in-JS constants, so the same tokens driving your SCSS also drive your components — no drift between the two outputs.

---

## 6. Hooks Package (`@yourorg/hooks`)

Ship as an independent package so it can be used without pulling in components (or even MUI, where possible):

Examples to include:
- `useThemeTokens()` — typed accessor into `theme.customTokens`
- `useBreakpoint()` — wraps MUI's `useMediaQuery` with your defined breakpoints
- `useDisclosure()` — open/close state for modals/menus/drawers
- `useControllableState()` — controlled/uncontrolled prop pattern used across your form components
- `useDebounce`, `useClickOutside`, `useFormField` (validation/error wiring)

```
hooks/src/
├── useThemeTokens/
├── useBreakpoint/
├── useDisclosure/
└── index.ts
```

---

## 7. Package Exports (root `package.json` per package)

Use modern `exports` maps so consumers can import exactly what they need (tree-shakeable, and lets SCSS ship alongside JS in the same package if you don't split them):

```jsonc
// @yourorg/tokens/package.json
{
  "name": "@yourorg/tokens",
  "main": "./dist/js/tokens.js",
  "types": "./dist/js/tokens.d.ts",
  "exports": {
    ".": "./dist/js/tokens.js",
    "./scss": "./dist/scss/_tokens.scss",
    "./css": "./dist/css/tokens.css"
  }
}
```

```jsonc
// @yourorg/components/package.json
{
  "name": "@yourorg/components",
  "peerDependencies": { "react": ">=18", "@mui/material": ">=5" },
  "exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/index.mjs" } }
}
```

Keep `react`, `react-dom`, and `@mui/material` as **peerDependencies** (not direct dependencies) to avoid version-mismatch/duplicate-React bugs downstream.

---

## 8. Build Tooling

- **Bundler:** vite 
- **Tokens:** Style Dictionary CLI, run in its own `build` step before `components` builds (Turborepo dependency graph: `tokens → theme → components/hooks`).
- **Type-checking:** TypeScript project references across packages.
- **Linting:** ESLint + a custom rule (or `stylelint` for SCSS) that flags hardcoded colors/spacing to enforce token usage.

---

## 9. Documentation & Visual QA

- **Storybook** as the living documentation site:
  - Token pages: render color swatches, spacing scale, type scale directly from `@yourorg/tokens` so docs never drift from actual values.
  - Component stories with controls (`argTypes`) for every prop.
  - Usage guidelines + code snippets (both React and "raw SCSS" usage examples) per component.
- **Visual regression testing:** Chromatic (pairs natively with Storybook) or Playwright + `pixelmatch` to catch unintended visual drift on token/theme changes.
- **Accessibility checks:** `@storybook/addon-a11y` + `jest-axe` in unit tests.

---

## 10. Testing Strategy

| Layer | Tooling |
|---|---|
| Unit / component behavior | Jest + React Testing Library |
| Accessibility | jest-axe, storybook a11y addon |
| Visual regression | Chromatic / Playwright screenshots |
| Token contract tests | Snapshot test that `dist/js/tokens.js`, `_tokens.scss`, `tokens.css` all contain matching values (prevents the 3 outputs drifting) |

---

## 11. Versioning & Release

- **Changesets** for semantic versioning + auto-generated changelogs across the monorepo's independent packages.
- Publish `@yourorg/tokens`, `@yourorg/theme`, `@yourorg/components`, `@yourorg/hooks` as separate npm packages (private registry or npm org scope) so consumers can depend only on what they need (e.g., a team not using React can depend on `@yourorg/tokens` alone for SCSS).
- **CI/CD (GitHub Actions/GitLab CI):**
  1. Lint + typecheck + unit tests on PR
  2. Build all packages (`turbo run build`)
  3. Chromatic visual diff on PR
  4. On merge to `main`: Changesets bot opens/updates a "Version Packages" PR; merging that PR triggers npm publish

---

## 12. Governance / Contribution Process

- Component API review checklist (naming consistency, `sx` support, ref forwarding, a11y, token-only styling).
- RFC process for adding new semantic tokens (avoid every team inventing one-off tokens).
- Deprecation policy: mark old tokens/components with `@deprecated` JSDoc + codemod scripts for migration where feasible.

---

## 13. Suggested Rollout Timeline

| Phase | Duration | Deliverable |
|---|---|---|
| 1. Token foundation | 1–2 wks | `@yourorg/tokens` published with JS/SCSS/CSS outputs, primitive + semantic layers defined |
| 2. Theme layer | 1 wk | `@yourorg/theme` mapping tokens → MUI theme, TS augmentation done |
| 3. Core components | 3–4 wks | Button, Input, Select, Checkbox, Radio, Typography, Card, Modal, Alert — highest-reuse components first |
| 4. Hooks package | parallel with Phase 3 | `useThemeTokens`, `useBreakpoint`, `useDisclosure`, form hooks |
| 5. Docs + visual QA | parallel, ongoing | Storybook site live, Chromatic wired into CI |
| 6. Adoption | ongoing | Migrate 1 pilot app, gather feedback, iterate before org-wide rollout |

---

## 14. Key Decisions to Confirm Before Starting

- MUI major version target (v5 vs v6 — affects theming API and Emotion vs. other styling engine choice).
- Whether tokens should follow the **W3C Design Tokens Community Group format** (future-proofs for tools like Tokens Studio/Figma sync) vs. a simpler custom JSON shape.
- npm registry: public scoped package vs. private registry (Verdaccio/GitHub Packages/Artifactory).
- Monorepo tool: Turborepo (simpler) vs. Nx (more powerful generators/graph, steeper setup).
