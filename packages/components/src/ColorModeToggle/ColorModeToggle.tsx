import { useColorScheme } from "@mui/material/styles";

import { Button } from "../Button/Button.js";

export type ColorModeToggleProps = {
  className?: string;
};

export function ColorModeToggle({ className }: ColorModeToggleProps) {
  const { mode, setMode } = useColorScheme();

  const resolved = mode === "system" ? "light" : mode;
  const next = resolved === "light" ? "dark" : "light";

  return (
    <Button
      className={className}
      variant="outlined"
      size="small"
      onClick={() => setMode(next)}
      aria-label={`Switch to ${next} mode`}
    >
      {resolved === "light" ? "Dark" : "Light"}
    </Button>
  );
}
