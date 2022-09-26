import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Button } from "../../src/actions/Button"
import { ButtonGroup } from "../../src/actions/ButtonGroup"
import { AppearanceSizeType } from "../../src/global/AppearanceTypes"

afterEach(cleanup)

describe("<ButtonGroup>", () => {
  it("renders buttons within the group", () => {
    const { container, getByText } = render(
      <ButtonGroup
        columns={[
          <Button size={AppearanceSizeType.small} iconPlacement={"left"} icon={`arrowDown`}>
            Button Content
          </Button>,
          <Button>Right Button Content</Button>,
        ]}
      />
    )

    expect(getByText("Button Content")).not.toBeNull()
    expect(container.getElementsByClassName("button-group__column").length).toBe(2)
    expect(container.getElementsByClassName("has-icon-left").length).toBe(1)
  })
})
