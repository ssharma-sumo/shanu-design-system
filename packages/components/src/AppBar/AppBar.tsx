import MuiAppBar from "@mui/material/AppBar";
import { forwardRef } from "react";

import type { AppBarProps } from "./AppBar.types.js";

export const AppBar = forwardRef<HTMLDivElement, AppBarProps>(function AppBar(props, ref) {
  return <MuiAppBar ref={ref} color="default" position="sticky" {...props} />;
});
