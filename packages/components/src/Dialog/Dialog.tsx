import MuiDialog from "@mui/material/Dialog";
import { forwardRef } from "react";

import type { DialogProps } from "./Dialog.types.js";

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  return <MuiDialog ref={ref} {...props} />;
});
