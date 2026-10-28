import { t } from "@bloom-housing/ui-components"
import { applyTranslations, overrideTranslations, translations } from "../../src/lib/translations"

describe("applyTranslations", () => {
  // Supplied by the bundled Partners override file and by neither shared locale file, so a
  // non-English reader has no translation of it to fall back to.
  const PARTNERS_ONLY_KEY = "nav.siteTitlePartners"
  const BUNDLED_VALUE = overrideTranslations.en[PARTNERS_ONLY_KEY]
  // Supplied by both shared locale files with different values, so precedence is visible.
  const TRANSLATED_KEY = "t.accessibility"

  afterEach(() => applyTranslations("en"))

  it("layers the bundled overrides over the base", () => {
    applyTranslations("en")

    expect(BUNDLED_VALUE).toBeTruthy()
    expect(t(PARTNERS_ONLY_KEY)).toEqual(BUNDLED_VALUE)
  })

  it("keeps base keys the overrides do not touch", () => {
    applyTranslations("en")

    expect(t(TRANSLATED_KEY)).toEqual(translations.general[TRANSLATED_KEY])
  })

  it("lets a stored override win over the bundled one", () => {
    applyTranslations("en", { en: { [PARTNERS_ONLY_KEY]: "From the database" } })

    expect(t(PARTNERS_ONLY_KEY)).toEqual("From the database")
  })

  it("keeps bundled keys that have no stored override", () => {
    applyTranslations("en", { en: { [TRANSLATED_KEY]: "Stored value" } })

    expect(t(TRANSLATED_KEY)).toEqual("Stored value")
    expect(t(PARTNERS_ONLY_KEY)).toEqual(BUNDLED_VALUE)
  })

  it("applies the locale base for a non-English locale", () => {
    applyTranslations("es")

    expect(translations.es[TRANSLATED_KEY]).not.toEqual(translations.general[TRANSLATED_KEY])
    expect(t(TRANSLATED_KEY)).toEqual(translations.es[TRANSLATED_KEY])
  })

  // The point of returning the layers apart. Editing the English wording must not take a reader's
  // translation away from them.
  it("keeps a translation when only the English value is overridden", () => {
    applyTranslations("es", { en: { [TRANSLATED_KEY]: "Reworded in English" } })

    expect(t(TRANSLATED_KEY)).toEqual(translations.es[TRANSLATED_KEY])
  })

  it("lets a stored override for the locale win over its base", () => {
    applyTranslations("es", {
      en: { [TRANSLATED_KEY]: "Reworded in English" },
      es: { [TRANSLATED_KEY]: "Desde la base de datos" },
    })

    expect(t(TRANSLATED_KEY)).toEqual("Desde la base de datos")
  })

  // The English layers still sit under the locale ones, so a key with nothing to fall back to
  // reads the English override rather than nothing.
  it("uses an English override for a key the locale does not translate", () => {
    applyTranslations("es", { en: { [PARTNERS_ONLY_KEY]: "From the database" } })

    expect(translations.es[PARTNERS_ONLY_KEY]).toBeUndefined()
    expect(t(PARTNERS_ONLY_KEY)).toEqual("From the database")
  })

  it("resets between calls rather than accumulating", () => {
    applyTranslations("en", { en: { [PARTNERS_ONLY_KEY]: "From the database" } })
    applyTranslations("en")

    expect(t(PARTNERS_ONLY_KEY)).toEqual(BUNDLED_VALUE)
  })
})
