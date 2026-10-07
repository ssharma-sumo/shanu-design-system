import type { PaletteOptions } from "@mui/material/styles";

import type { ShanuTokenSet } from "./types.js";

export function mapTokensToPalette(tokens: ShanuTokenSet): PaletteOptions {
  return {
    primary: {
      main: tokens.ColorBrandPrimary,
      dark: tokens.ColorBrandPrimaryActive,
      light: tokens.ColorBrandPrimaryHover,
      contrastText: tokens.ColorBrandOnPrimary,
    },
    secondary: {
      main: tokens.ColorBrandSecondary,
      dark: tokens.ColorBrandSecondaryHover,
      contrastText: tokens.ColorBrandOnSecondary,
    },
    error: {
      main: tokens.ColorFeedbackErrorFg,
      light: tokens.ColorFeedbackErrorBg,
      dark: tokens.ColorFeedbackErrorBorder,
    },
    warning: {
      main: tokens.ColorFeedbackWarningFg,
      light: tokens.ColorFeedbackWarningBg,
      dark: tokens.ColorFeedbackWarningBorder,
    },
    info: {
      main: tokens.ColorFeedbackInfoFg,
      light: tokens.ColorFeedbackInfoBg,
      dark: tokens.ColorFeedbackInfoBorder,
    },
    success: {
      main: tokens.ColorFeedbackSuccessFg,
      light: tokens.ColorFeedbackSuccessBg,
      dark: tokens.ColorFeedbackSuccessBorder,
    },
    text: {
      primary: tokens.ColorTextPrimary,
      secondary: tokens.ColorTextSecondary,
      disabled: tokens.ColorTextDisabled,
    },
    background: {
      default: tokens.ColorBackgroundCanvas,
      paper: tokens.ColorBackgroundSurface,
    },
    divider: tokens.ColorBorderDefault,
    action: {
      hover: tokens.ColorActionHover,
      selected: tokens.ColorActionSelected,
      disabled: tokens.ColorActionDisabled,
      disabledBackground: tokens.ColorActionDisabledBackground,
      focus: tokens.ColorActionFocusVisible,
    },
  };
}
