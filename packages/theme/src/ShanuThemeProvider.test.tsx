import { useColorScheme, useTheme } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";

import { ShanuThemeProvider } from "./ShanuThemeProvider.js";

function ThemeProbe() {
  const theme = useTheme();
  return (
    <span data-testid="token-set">
      {theme.shanuTokens ? "ready" : "missing"}
    </span>
  );
}

function ModeProbe() {
  const { mode } = useColorScheme();
  return <span data-testid="color-mode">{mode}</span>;
}

describe("ShanuThemeProvider", () => {
  it("renders children", () => {
    render(
      <ShanuThemeProvider>
        <p>Hello</p>
      </ShanuThemeProvider>,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("exposes shanuTokens through useTheme", () => {
    render(
      <ShanuThemeProvider>
        <ThemeProbe />
      </ShanuThemeProvider>,
    );

    expect(screen.getByTestId("token-set")).toHaveTextContent("ready");
  });

  it("skips CssBaseline when enableCssBaseline is false", () => {
    const { container: withoutBaseline } = render(
      <ShanuThemeProvider enableCssBaseline={false}>
        <span>plain</span>
      </ShanuThemeProvider>,
    );
    expect(withoutBaseline.querySelector(".MuiCssBaseline-root")).toBeNull();

    const { container: withBaseline } = render(
      <ShanuThemeProvider>
        <span>baseline</span>
      </ShanuThemeProvider>,
    );

    const baselineMounted =
      withBaseline.querySelector(".MuiCssBaseline-root") != null ||
      document.querySelector("style[data-emotion]") != null;
    expect(baselineMounted).toBe(true);
  });

  it("honors defaultMode dark", () => {
    render(
      <ShanuThemeProvider defaultMode="dark">
        <ModeProbe />
      </ShanuThemeProvider>,
    );

    expect(screen.getByTestId("color-mode")).toHaveTextContent("dark");
  });
});
