import { screen } from "@testing-library/react";

import { renderWithTheme } from "../test-utils.js";
import { AppBar } from "./AppBar.js";

describe("AppBar", () => {
  it("renders as a banner with children", () => {
    renderWithTheme(<AppBar>Toolbar</AppBar>);

    expect(screen.getByRole("banner")).toHaveTextContent("Toolbar");
  });
});
