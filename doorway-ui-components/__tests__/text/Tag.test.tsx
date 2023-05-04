import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Tag } from "../../src/text/Tag"
import { AppearanceStyleType, AppearanceShadeType } from "../../src/global/AppearanceTypes"

afterEach(cleanup)

describe("<Tag>", () => {
  it("renders default state", () => {
    const { getByText } = render(<Tag>Children go here</Tag>)
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { container, getByText } = render(
      <Tag
        className={"custom-class"}
        pillStyle={true}
        styleType={AppearanceStyleType.success}
        shade={AppearanceShadeType.light}
        fillContainer={true}
      >
        Children go here
      </Tag>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })
})
