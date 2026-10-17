import type { CssVarsTheme, Theme } from "@mui/material/styles";
import * as darkTokens from "@shanu/tokens/dark";
import * as lightTokens from "@shanu/tokens/light";

import { createShanuTheme } from "./createShanuTheme.js";

describe("createShanuTheme", () => {
  const theme = createShanuTheme() as Theme & CssVarsTheme;

  it("uses the data color-scheme selector and both schemes", () => {
    expect(theme.colorSchemeSelector).toBe("data");
    expect(theme.colorSchemes.light).toBeDefined();
    expect(theme.colorSchemes.dark).toBeDefined();
  });

  it("maps spacing, shape, and breakpoints from light tokens", () => {
    expect(theme.spacing(1)).toBe(
      `var(--mui-spacing, ${Number(lightTokens.SpacingUnit)}px)`,
    );
    expect(theme.shape.borderRadius).toBe(Number(lightTokens.RadiusMd));
    expect(theme.breakpoints.values).toEqual({
      xs: 0,
      sm: Number(lightTokens.BreakpointSm),
      md: Number(lightTokens.BreakpointMd),
      lg: Number(lightTokens.BreakpointLg),
      xl: Number(lightTokens.BreakpointXl),
    });
  });

  it("attaches light and dark token sets on the theme", () => {
    expect(theme.shanuTokens.light).toBe(lightTokens);
    expect(theme.shanuTokens.dark).toBe(darkTokens);
  });

  it("applies component default props", () => {
    expect(theme.components?.MuiButton?.defaultProps?.disableElevation).toBe(
      true,
    );
    expect(theme.components?.MuiAppBar?.defaultProps?.elevation).toBe(0);
  });

  it("merges overrides after token-derived defaults", () => {
    const overridden = createShanuTheme({ overrides: { spacing: 12 } });

    expect(overridden.spacing(1)).toBe("var(--mui-spacing, 12px)");
  });
});
