import MuiButton from "@mui/material/Button";
import { forwardRef } from "react";

import type { ButtonProps } from "./Button.types.js";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref,
) {
  return <MuiButton ref={ref} {...props} />;
});
