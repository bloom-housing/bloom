import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Icon } from "../../src/icons/Icon"
import { AppearanceStyleType } from "../../src/global/AppearanceTypes"

afterEach(cleanup)

describe("<Icon>", () => {
  it("renders without error", () => {
    render(<Icon size="2xl" symbol="profile" />)
  })
  it("can render with a custom class", () => {
    const { container } = render(
      <Icon size="2xl" symbol="profile" white={true} className={"custom-class"} />
    )
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })
  it("supports different appearance types", () => {
    const { container } = render(
      <Icon size="2xl" symbol="profile" styleType={AppearanceStyleType.primary} />
    )
    expect(container.querySelectorAll(".ui-icon.is-primary").length).toBe(1)
  })
})
