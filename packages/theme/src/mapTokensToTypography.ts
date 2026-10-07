import type { TypographyVariantsOptions } from "@mui/material/styles";

import type { ShanuTokenSet } from "./types.js";

function px(value: string): string {
  return value.endsWith("px") ? value : `${value}px`;
}

export function mapTokensToTypography(tokens: ShanuTokenSet): TypographyVariantsOptions {
  const fontFamily = tokens.FontFamilySans;

  return {
    fontFamily,
    fontSize: Number(tokens.FontSizeMd),
    h1: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightBold),
      fontSize: px(tokens.FontSize3xl),
      lineHeight: tokens.FontLineHeightTight,
    },
    h2: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightSemibold),
      fontSize: px(tokens.FontSize2xl),
      lineHeight: tokens.FontLineHeightTight,
    },
    h3: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightSemibold),
      fontSize: px(tokens.FontSizeXl),
      lineHeight: tokens.FontLineHeightTight,
    },
    h4: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightMedium),
      fontSize: px(tokens.FontSizeLg),
      lineHeight: tokens.FontLineHeightNormal,
    },
    body1: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightRegular),
      fontSize: px(tokens.FontSizeMd),
      lineHeight: tokens.FontLineHeightNormal,
    },
    body2: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightRegular),
      fontSize: px(tokens.FontSizeSm),
      lineHeight: tokens.FontLineHeightNormal,
    },
    button: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightMedium),
      fontSize: px(tokens.FontSizeSm),
      lineHeight: tokens.FontLineHeightNormal,
      textTransform: "none",
    },
    caption: {
      fontFamily,
      fontWeight: Number(tokens.FontWeightRegular),
      fontSize: px(tokens.FontSizeXs),
      lineHeight: tokens.FontLineHeightNormal,
    },
  };
}
