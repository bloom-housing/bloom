import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LanguageNav } from "../../src/navigation/LanguageNav"

afterEach(cleanup)

describe("<LanguageNav>", () => {
  it("renders without error", () => {
    const props = {
      language: {
        list: [
          {
            prefix: "",
            label: "English",
          },
          {
            prefix: "es",
            label: "Spanish",
          },
        ],
        codes: ["en", "es"],
      },
    }

    const { getByText } = render(<LanguageNav language={props.language} />)
    expect(getByText("English")).toBeTruthy()
    expect(getByText("Spanish")).toBeTruthy()
  })
})
