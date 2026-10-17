import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const appDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(appDir, "../../..");

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../../../packages/components/src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@shanu/components": resolve(
            repoRoot,
            "packages/components/src/index.ts",
          ),
          "@shanu/theme": resolve(repoRoot, "packages/theme/src/index.ts"),
        },
      },
    });
  },
};

export default config;
