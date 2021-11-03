import { cleanup } from "@testing-library/react"
import { lRoute } from "../src/localeRoute"
import { addTranslation } from "@bloom-housing/ui-components"
import spanishTranslations from "@bloom-housing/ui-components/src/locales/es.json"
import chineseTranslations from "@bloom-housing/ui-components/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/ui-components/src/locales/vi.json"
import generalTranslations from "@bloom-housing/ui-components/src/locales/general.json"

afterEach(cleanup)

describe("localeRoute helper", () => {
  it("return input if its a full URL", () => {
    expect(lRoute("https://www.google.com")).toBe("https://www.google.com")
    expect(lRoute("http://www.google.com")).toBe("http://www.google.com")
  })
  it("returns localized route if its a relative url", () => {
    addTranslation(spanishTranslations)
    expect(lRoute("/some/page")).toBe("/es/some/page")
    addTranslation(chineseTranslations)
    expect(lRoute("/some/page")).toBe("/zh/some/page")
    addTranslation(vietnameseTranslations)
    expect(lRoute("/some/page")).toBe("/vi/some/page")
    addTranslation(generalTranslations)
    expect(lRoute("/some/page")).toBe("/some/page")
  })
})
