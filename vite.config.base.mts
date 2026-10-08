import { existsSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dts from "vite-plugin-dts";
import { defineConfig, type Plugin } from "vite";

function ensureEsmEntry(packageDir: string): Plugin {
  return {
    name: "ensure-esm-entry",
    closeBundle() {
      const file = resolve(packageDir, "dist/index.js");
      if (!existsSync(file) || statSync(file).size === 0) {
        writeFileSync(file, "export {};\n");
      }
    },
  };
}

export function createPackageConfig(options: {
  entry: string;
  packageDir: string;
  external?: (string | RegExp)[];
}) {
  return defineConfig({
    build: {
      lib: {
        entry: resolve(options.packageDir, options.entry),
        formats: ["es"],
        fileName: "index",
      },
      outDir: "dist",
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          /^@mui\//,
          /^@emotion\//,
          /^@shanu\//,
          ...(options.external ?? []),
        ],
      },
    },
    plugins: [
      dts({
        include: ["src"],
        outDir: "dist",
        rollupTypes: false,
      }),
      ensureEsmEntry(options.packageDir),
    ],
  });
}

export function packageDirFromUrl(metaUrl: string): string {
  return fileURLToPath(new URL(".", metaUrl));
}
