import type * as darkTokens from "@shanu/tokens/dark";
import type * as lightTokens from "@shanu/tokens/light";

declare module "@mui/material/styles" {
  interface Theme {
    shanuTokens: {
      light: typeof lightTokens;
      dark: typeof darkTokens;
    };
  }

  interface ThemeOptions {
    shanuTokens?: {
      light: typeof lightTokens;
      dark: typeof darkTokens;
    };
  }
}

export {};
