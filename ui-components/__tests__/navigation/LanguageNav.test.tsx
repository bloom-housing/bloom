import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LanguageNav } from "../../src/navigation/LanguageNav"
import { t } from "../../src/helpers/translator"
import { mocked } from "ts-jest/utils"

jest.mock("../../src/helpers/translator")
const mockedT = mocked(t, true)

afterEach(cleanup)

describe("<LanguageNav>", () => {
  it("renders without error", () => {
    const language = {
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
    }

    const { getByText } = render(<LanguageNav language={language} />)
    expect(getByText("English")).toBeTruthy()
    expect(getByText("Spanish")).toBeTruthy()
  })

  it("sets is-active on correct item", () => {
    const language = {
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
    }

    mockedT.mockReturnValue("es")

    const { getByText } = render(<LanguageNav language={language} />)
    expect(getByText("English").className).not.toContain("is-active")
    expect(getByText("Spanish").className).toContain("is-active")
  })
})
