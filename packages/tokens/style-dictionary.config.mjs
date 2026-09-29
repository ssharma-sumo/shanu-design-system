import StyleDictionary from "style-dictionary";

/**
 * One build per theme. Each build shares tokens/core.json (primitives)
 * plus its own tokens/{theme}.json (semantic aliases). Outputs land in
 * build/{theme}/{css,scss,ts}.
 *
 * CSS is emitted scoped to `[data-mui-color-scheme="light|dark"]` (not
 * `:root`) so both files can be loaded at once and MUI's runtime
 * attribute switch — the same one wired up in theme.ts — controls
 * which set of variables is active, with zero flash on load.
 */
const themes = ["light", "dark"];

for (const theme of themes) {
  const sd = new StyleDictionary({
    source: [`tokens/core.json`, `tokens/${theme}.json`],
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: `build/${theme}/`,
        files: [
          {
            destination: "variables.css",
            format: "css/variables",
            filter: (token) => token.path[0] === "color" && token.path[1] !== "primitive",
            options: {
              selector: `[data-mui-color-scheme="${theme}"]`,
              outputReferences: false,
            },
          },
        ],
      },
      scss: {
        transformGroup: "scss",
        buildPath: `build/${theme}/`,
        files: [
          {
            destination: "_variables.scss",
            format: "scss/variables",
            filter: (token) => token.path[0] === "color" && token.path[1] !== "primitive",
          },
        ],
      },
      ts: {
        transformGroup: "js",
        buildPath: `build/${theme}/`,
        files: [
          {
            destination: "tokens.ts",
            format: "javascript/es6",
            filter: (token) => token.path[0] === "color" && token.path[1] !== "primitive",
          },
          {
            destination: "tokens.d.ts",
            format: "typescript/es6-declarations",
            filter: (token) => token.path[0] === "color" && token.path[1] !== "primitive",
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}
