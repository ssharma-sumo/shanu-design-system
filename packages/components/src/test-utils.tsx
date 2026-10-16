import "./test-setup.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

const testTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
});

function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={testTheme} defaultMode="light">
      {children}
    </ThemeProvider>
  );
}

export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult {
  return render(ui, { wrapper: ThemeWrapper, ...options });
}
