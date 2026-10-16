import { screen } from "@testing-library/react";

import { renderWithTheme } from "../test-utils.js";
import { Dialog } from "./Dialog.js";

describe("Dialog", () => {
  it("does not expose a dialog role when closed", () => {
    renderWithTheme(
      <Dialog open={false} aria-labelledby="dialog-title">
        <h2 id="dialog-title">Confirm</h2>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exposes a dialog role when open", () => {
    renderWithTheme(
      <Dialog open aria-labelledby="dialog-title">
        <h2 id="dialog-title">Confirm</h2>
      </Dialog>,
    );

    expect(screen.getByRole("dialog", { name: "Confirm" })).toBeInTheDocument();
  });
});
