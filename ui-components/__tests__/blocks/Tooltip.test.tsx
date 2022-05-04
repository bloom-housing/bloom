import React from "react"
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react"
import { Tooltip } from "../../src/blocks/Tooltip"

afterEach(cleanup)

describe("<Tooltip>", () => {
  it("render tooltip on hover", async () => {
    const { getByTestId } = render(<Tooltip id="tooltip" text="Lorem ipsum" />)

    fireEvent.mouseOver(getByTestId("tooltip-children"))
    await waitFor(() => expect(getByTestId("tooltip-element")).toBeVisible())
  })

  it("render tooltip on focus", async () => {
    const { getByTestId } = render(<Tooltip id="tooltip" text="Lorem ipsum" />)

    fireEvent.focus(getByTestId("tooltip-children"))
    await waitFor(() => expect(getByTestId("tooltip-element")).toBeVisible())
  })
})
