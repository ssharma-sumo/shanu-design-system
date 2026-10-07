import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, type Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

import { createShanuTheme, type ShanuThemeOptions } from "./createShanuTheme.js";

export type ShanuThemeProviderProps = {
  children: ReactNode;
  theme?: Theme;
  themeOptions?: ShanuThemeOptions;
  /** When true, normalizes margin/box-sizing and applies token-aligned body styles. */
  enableCssBaseline?: boolean;
  defaultMode?: "light" | "dark" | "system";
};

export function ShanuThemeProvider({
  children,
  theme,
  themeOptions,
  enableCssBaseline = true,
  defaultMode = "light",
}: ShanuThemeProviderProps) {
  const resolvedTheme = theme ?? createShanuTheme(themeOptions);

  return (
    <ThemeProvider theme={resolvedTheme} defaultMode={defaultMode}>
      {enableCssBaseline ? <CssBaseline /> : null}
      {children}
    </ThemeProvider>
  );
}
