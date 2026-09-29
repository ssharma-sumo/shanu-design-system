# `@shanu/tokens`

Design tokens built with Style Dictionary — CSS, SCSS, and TypeScript outputs for light and dark modes.

## Structure

```
tokens/
  core.json    ← primitives only (violet/teal/neutral/etc ramps). Mode-agnostic, never build this alone.
  light.json   ← semantic tokens for light mode, each value aliasing a core.json primitive
  dark.json    ← semantic tokens for dark mode, same shape as light.json
style-dictionary.config.mjs
build/         ← generated outputs (gitignored)
```

Both `light.json` and `dark.json` use the same semantic keys (`color.background.canvas`, `color.text.primary`, `color.brand.primary`, `color.feedback.errorFg`, …) — only the resolved value differs per mode. That symmetry is what lets one component reference `color.text.primary` and get the right value regardless of which theme is active; only `core.json` + one of the two theme files needs to change to retheme.

Values point at primitives via Style Dictionary's reference syntax:

```json
"primary": { "value": "{color.primitive.violet.500}" }
```

A few tokens (overlay scrims, alpha-based hover/selected states) are plain `rgba()` literals rather than references, since they're mode-specific alpha values with no primitive equivalent.

## Build

From the repo root:

```bash
pnpm --filter @shanu/tokens build
```

Or from this package:

```bash
pnpm build
```

This produces, per theme:

```
build/light/variables.css      → CSS custom properties scoped to [data-mui-color-scheme="light"]
build/light/_variables.scss    → $color-background-canvas: #F7F7F9; ...
build/light/tokens.ts          → export const ColorBackgroundCanvas = "#F7F7F9"; ...
build/light/tokens.d.ts
build/dark/...                 → same three formats, dark values
```

## Package exports

| Import | Output |
|---|---|
| `@shanu/tokens` / `@shanu/tokens/light` | Light TS constants |
| `@shanu/tokens/dark` | Dark TS constants |
| `@shanu/tokens/css/light` | Light CSS variables |
| `@shanu/tokens/css/dark` | Dark CSS variables |
| `@shanu/tokens/scss/light` | Light SCSS variables |
| `@shanu/tokens/scss/dark` | Dark SCSS variables |

## Why CSS is scoped to an attribute selector, not `:root`

The MUI theme toggles schemes via a `data-mui-color-scheme="light" | "dark"` attribute rather than remounting the ThemeProvider. Scoping the generated CSS the same way means:

- Both `variables.css` files can be loaded together with no `:root` collision.
- Switching themes is just flipping the attribute — instant, no FOUC.
- The generated CSS variables and MUI's own `var(--mui-palette-*)` layer stay conceptually aligned even though they're produced by two different tools.

If your pipeline doesn't need that (e.g. you load only one theme's CSS at a time, server-rendered per request), change `options.selector` in `style-dictionary.config.mjs` to `:root` for both themes.

## Adding a token

1. Add the primitive to `core.json` if it's a new hue/stop.
2. Add the *same key* to both `light.json` and `dark.json` under the right semantic category, referencing the primitive (or a literal for alpha/overlay values).
3. Rebuild — it flows through to CSS, SCSS, and TS automatically since all three platforms share the same filtered token set.

## Notes

- The `filter` in each platform excludes `color.primitive.*` from every output — primitives are internal plumbing for resolving references, not something components should ever consume directly.
- `outputReferences: false` on the CSS platform means the *resolved* hex/rgba lands in the CSS file, not a chain of `var(--color-primitive-violet-500)`. Flip it to `true` if you'd rather keep the primitive layer visible in the CSS output too.
