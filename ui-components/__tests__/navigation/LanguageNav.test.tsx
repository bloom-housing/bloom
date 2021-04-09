import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { LanguageNav, LangItem } from "../../src/navigation/LanguageNav"

const ENGLISH_LANG_ITEM: LangItem = {
  prefix: "",
  label: "English",
}

const SPANISH_LANG_ITEM: LangItem = {
  prefix: "es",
  label: "Spanish",
}

afterEach(cleanup)

describe("<LanguageNav>", () => {
  it("renders without error", () => {
    const onChangeLanguageSpy = jest.fn()
    const { getByText } = render(
      <LanguageNav
        onChangeLanguage={onChangeLanguageSpy}
        currentLanguagePrefix={SPANISH_LANG_ITEM.prefix}
        items={[ENGLISH_LANG_ITEM, SPANISH_LANG_ITEM]}
      />
    )

    expect(onChangeLanguageSpy).toHaveBeenCalledTimes(0)
    expect(getByText("English")).toBeTruthy()
    expect(getByText("Spanish")).toBeTruthy()
  })

  it("calls onChangeLanguage", () => {
    const onChangeLanguageSpy = jest.fn()
    const {  getByText } = render(
      <LanguageNav
        onChangeLanguage={onChangeLanguageSpy}
        currentLanguagePrefix={SPANISH_LANG_ITEM.prefix}
        items={[ENGLISH_LANG_ITEM, SPANISH_LANG_ITEM]}
      />
    )

    fireEvent.click(getByText("English"))

    expect(onChangeLanguageSpy).toHaveBeenCalledTimes(1)
  })
})
