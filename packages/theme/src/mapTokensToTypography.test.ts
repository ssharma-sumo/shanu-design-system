import * as lightTokens from "@shanu/tokens/light";

import { mapTokensToTypography } from "./mapTokensToTypography.js";

describe("mapTokensToTypography", () => {
  it("maps sans font, heading size, and button transform from tokens", () => {
    const typography = mapTokensToTypography(lightTokens);

    expect(typography.fontFamily).toBe(lightTokens.FontFamilySans);
    expect(typography.h1?.fontSize).toBe(`${lightTokens.FontSize3xl}px`);
    expect(typography.button?.textTransform).toBe("none");
  });
});
