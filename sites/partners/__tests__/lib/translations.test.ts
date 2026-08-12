import { t } from "@bloom-housing/ui-components"
import { applyTranslations, overrideTranslations, translations } from "../../src/lib/translations"

describe("applyTranslations", () => {
  // A key the bundled override file supplies, so the layering below it can be checked.
  const OVERRIDDEN_KEY = "nav.siteTitlePartners"
  const BUNDLED_VALUE = overrideTranslations.en[OVERRIDDEN_KEY]
  // Supplied only by the shared base, so neither Partners file masks it.
  const BASE_ONLY_KEY = "t.accessibility"

  afterEach(() => applyTranslations("en"))

  it("layers the bundled overrides over the base", () => {
    applyTranslations("en")

    expect(BUNDLED_VALUE).toBeTruthy()
    expect(t(OVERRIDDEN_KEY)).toEqual(BUNDLED_VALUE)
  })

  it("keeps base keys the overrides do not touch", () => {
    applyTranslations("en")

    expect(t(BASE_ONLY_KEY)).toEqual(translations.general[BASE_ONLY_KEY])
  })

  it("lets a stored override win over the bundled one", () => {
    applyTranslations("en", { [OVERRIDDEN_KEY]: "From the database" })

    expect(t(OVERRIDDEN_KEY)).toEqual("From the database")
  })

  it("keeps bundled keys that have no stored override", () => {
    applyTranslations("en", { [BASE_ONLY_KEY]: "Stored value" })

    expect(t(BASE_ONLY_KEY)).toEqual("Stored value")
    expect(t(OVERRIDDEN_KEY)).toEqual(BUNDLED_VALUE)
  })

  it("reproduces the bundled result when there are no stored overrides", () => {
    applyTranslations("en", {})
    const withEmpty = t(OVERRIDDEN_KEY)

    applyTranslations("en")
    expect(t(OVERRIDDEN_KEY)).toEqual(withEmpty)
  })

  it("applies the locale base for a non-English locale", () => {
    applyTranslations("es")

    expect(t(BASE_ONLY_KEY)).toEqual(translations.es[BASE_ONLY_KEY])
  })

  it("lets a stored override win over a locale base value", () => {
    applyTranslations("es", { [BASE_ONLY_KEY]: "Desde la base de datos" })

    expect(t(BASE_ONLY_KEY)).toEqual("Desde la base de datos")
  })

  it("resets between calls rather than accumulating", () => {
    applyTranslations("en", { [OVERRIDDEN_KEY]: "From the database" })
    applyTranslations("en")

    expect(t(OVERRIDDEN_KEY)).toEqual(BUNDLED_VALUE)
  })
})
