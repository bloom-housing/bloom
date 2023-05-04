import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LanguageNav } from "../../src/navigation/LanguageNav"

afterEach(cleanup)

describe("<LanguageNav>", () => {
  it("renders without error", () => {
    const languages = [
      {
        label: "English",
        active: true,
        onClick: jest.fn(),
      },
      {
        label: "Spanish",
        active: false,
        onClick: jest.fn(),
      },
    ]

    const { getByText } = render(<LanguageNav languages={languages} />)
    expect(getByText("English")).toBeTruthy()
    expect(getByText("Spanish")).toBeTruthy()
  })
})
