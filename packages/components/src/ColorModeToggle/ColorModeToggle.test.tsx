import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../test-utils.js";
import { ColorModeToggle } from "./ColorModeToggle.js";

describe("ColorModeToggle", () => {
  it("defaults to switching into dark mode", () => {
    renderWithTheme(<ColorModeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });

  it("updates the label after toggling mode", async () => {
    const user = userEvent.setup();

    renderWithTheme(<ColorModeToggle />);
    await user.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );

    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });
});
