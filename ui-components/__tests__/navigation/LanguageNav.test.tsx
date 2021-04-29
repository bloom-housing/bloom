import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LanguageNav } from "../../src/navigation/LanguageNav"
import * as useLanguageChange from "../../src/helpers/useLanguageChange"

afterEach(cleanup)

describe("<LanguageNav>", () => {
  it("renders without error", () => {
    const useLanguageChangeSpy = jest.spyOn(useLanguageChange, "useLanguageChange")
    const { getByText } = render(
      <LanguageNav
      language={{
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
        codes: ['en', 'es']
      }}
      />
    )
    expect(useLanguageChangeSpy).toHaveBeenCalledWith([
      { label: "English", prefix: "" },
      { label: "Spanish", prefix: "es" },
    ])
    expect(getByText("English")).toBeTruthy()
    expect(getByText("Spanish")).toBeTruthy()
  })
})
