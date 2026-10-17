import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "packages/tokens/build/**",
      "**/storybook-static/**",
      "coverage/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,mts,cts,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      {
        files: ["**/*.{js,mjs,cjs,mts,cts,ts,tsx}"],
        languageOptions: {
          globals: {
            ...globals.browser,
            ...globals.node,
          },
        },
      },
      {
        ...reactHooks.configs.flat.recommended,
        files: ["**/*.{js,jsx,ts,tsx}"],
      },
      {
        files: [
          "**/*.{test,spec}.{ts,tsx}",
          "**/test-setup.ts",
          "**/test-utils.tsx",
        ],
        languageOptions: {
          globals: {
            ...globals.vitest,
          },
        },
      },
      eslintConfigPrettier,
    ],
  },
]);
