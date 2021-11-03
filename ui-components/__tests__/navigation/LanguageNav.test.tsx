import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LanguageNav } from "../../src/navigation/LanguageNav"
import { t } from "../../src/helpers/translator"
import { mocked } from "ts-jest/utils"

afterEach(cleanup)

describe("<LanguageNav>", () => {
  it("renders without error", () => {
    const languages = [
      {
        label: "English",
        active: true,
        onClick: () => {},
      },
      {
        label: "Spanish",
        active: false,
        onClick: () => {},
      },
    ]

    const { getByText } = render(<LanguageNav languages={languages} />)
    expect(getByText("English")).toBeTruthy()
    expect(getByText("Spanish")).toBeTruthy()
  })

  it("sets is-active on correct item", () => {
    const languages = [
      {
        label: "English",
        active: false,
        onClick: () => {},
      },
      {
        label: "Spanish",
        active: true,
        onClick: () => {},
      },
    ]

    const { getByText } = render(<LanguageNav languages={languages} />)
    expect(getByText("English").className).not.toContain("is-active")
    expect(getByText("Spanish").className).toContain("is-active")
  })
})
