import type { PaletteColorOptions } from "@mui/material/styles";
import * as darkTokens from "@shanu/tokens/dark";
import * as lightTokens from "@shanu/tokens/light";

import { mapTokensToPalette } from "./mapTokensToPalette.js";

function paletteMain(color: PaletteColorOptions | undefined) {
  return color && "main" in color ? color.main : undefined;
}

describe("mapTokensToPalette", () => {
  it("maps light brand, text, background, and divider tokens", () => {
    const palette = mapTokensToPalette(lightTokens);

    expect(paletteMain(palette.primary)).toBe(lightTokens.ColorBrandPrimary);
    expect(palette.text?.primary).toBe(lightTokens.ColorTextPrimary);
    expect(palette.background?.default).toBe(lightTokens.ColorBackgroundCanvas);
    expect(palette.divider).toBe(lightTokens.ColorBorderDefault);
  });

  it("maps the same fields from dark tokens with different values", () => {
    const lightPalette = mapTokensToPalette(lightTokens);
    const darkPalette = mapTokensToPalette(darkTokens);

    expect(paletteMain(darkPalette.primary)).toBe(darkTokens.ColorBrandPrimary);
    expect(darkPalette.text?.primary).toBe(darkTokens.ColorTextPrimary);
    expect(darkPalette.background?.default).toBe(
      darkTokens.ColorBackgroundCanvas,
    );
    expect(darkPalette.divider).toBe(darkTokens.ColorBorderDefault);

    expect(darkPalette.text?.primary).not.toBe(lightPalette.text?.primary);
    expect(darkPalette.background?.default).not.toBe(
      lightPalette.background?.default,
    );
  });
});
