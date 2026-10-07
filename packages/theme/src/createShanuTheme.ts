import { createTheme } from "@mui/material/styles";
import * as darkTokens from "@shanu/tokens/dark";
import * as lightTokens from "@shanu/tokens/light";

import { createComponentOverrides } from "./componentOverrides.js";
import { mapTokensToPalette } from "./mapTokensToPalette.js";
import { mapTokensToTypography } from "./mapTokensToTypography.js";
import type { ShanuTokenSet } from "./types.js";

const spacingUnit = Number(lightTokens.SpacingUnit);
const shapeBorderRadius = Number(lightTokens.RadiusMd);

function schemeOptions(tokens: ShanuTokenSet) {
  return {
    palette: mapTokensToPalette(tokens),
    typography: mapTokensToTypography(tokens),
  };
}

export type ShanuThemeOptions = {
  /** Merged after token-derived defaults (color schemes, typography, components). */
  overrides?: Parameters<typeof createTheme>[0];
};

export function createShanuTheme(options: ShanuThemeOptions = {}) {
  const { overrides } = options;

  return createTheme({
    cssVariables: {
      colorSchemeSelector: "data",
    },
    colorSchemes: {
      light: schemeOptions(lightTokens),
      dark: schemeOptions(darkTokens),
    },
    spacing: spacingUnit,
    shape: {
      borderRadius: shapeBorderRadius,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: Number(lightTokens.BreakpointSm),
        md: Number(lightTokens.BreakpointMd),
        lg: Number(lightTokens.BreakpointLg),
        xl: Number(lightTokens.BreakpointXl),
      },
    },
    components: createComponentOverrides(),
    shanuTokens: {
      light: lightTokens,
      dark: darkTokens,
    },
    ...overrides,
  });
}

export const shanuTheme = createShanuTheme();
