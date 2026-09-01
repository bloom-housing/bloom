// Synthetic fixtures for the layers applyTranslations merges, so this suite verifies the merge
// contract itself rather than incidental properties of today's real translation content (a key
// being English-only, differing between locales, etc. can change during normal content edits).
const TEST_GENERAL_EN = { "test.translated": "General English value" }
const TEST_GENERAL_ES = { "test.translated": "General Spanish value" }
const TEST_OVERRIDE_EN = {
  "test.overrideOnly": "Bundled English-only override",
  "test.bundledLocale": "Bundled English override, locale key",
}
const TEST_OVERRIDE_ES = {
  "test.bundledLocale": "Bundled Spanish override, locale key",
}

jest.mock("@bloom-housing/shared-helpers/src/locales/general.json", () => TEST_GENERAL_EN)
jest.mock("@bloom-housing/shared-helpers/src/locales/es.json", () => TEST_GENERAL_ES)
jest.mock("../../page_content/locale_overrides/general.json", () => TEST_OVERRIDE_EN)
jest.mock("../../page_content/locale_overrides/es.json", () => TEST_OVERRIDE_ES)

import { t } from "@bloom-housing/ui-components"
import { tIfExists } from "@bloom-housing/shared-helpers"
import { applyTranslations, overrideTranslations, translations } from "../../src/lib/translations"

describe("applyTranslations", () => {
  // Supplied by the bundled English override file and by neither shared locale file, so a
  // non-English reader has no translation of it to fall back to.
  const OVERRIDE_ONLY_KEY = "test.overrideOnly"
  const BUNDLED_VALUE = overrideTranslations.en[OVERRIDE_ONLY_KEY]
  // Supplied by both shared locale files with different values, so precedence is visible.
  const TRANSLATED_KEY = "test.translated"
  // Supplied by both bundled public override files, with a different value in each.
  const BUNDLED_LOCALE_KEY = "test.bundledLocale"

  beforeEach(() => applyTranslations("en"))

  it("layers the bundled overrides over the shared base", () => {
    applyTranslations("en")

    expect(BUNDLED_VALUE).toBeTruthy()
    expect(t(OVERRIDE_ONLY_KEY)).toEqual(BUNDLED_VALUE)
  })

  it("keeps shared base keys the overrides do not touch", () => {
    applyTranslations("en")

    expect(t(TRANSLATED_KEY)).toEqual(translations.general[TRANSLATED_KEY])
  })

  it("lets a stored override win over the bundled one", () => {
    applyTranslations("en", { en: { [OVERRIDE_ONLY_KEY]: "From the database" } })

    expect(t(OVERRIDE_ONLY_KEY)).toEqual("From the database")
  })

  it("applies the shared locale base for a non-English locale", () => {
    applyTranslations("es")

    expect(translations.es[TRANSLATED_KEY]).not.toEqual(translations.general[TRANSLATED_KEY])
    expect(t(TRANSLATED_KEY)).toEqual(translations.es[TRANSLATED_KEY])
  })

  // Editing the English wording must not take a reader's translation away from them.
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

  // BUNDLED_LOCALE_KEY is supplied by the mocked es override layer, so this is the only assertion
  // that fails if that layer stops loading.
  it("applies the site's own bundled file for the locale", () => {
    applyTranslations("es")

    expect(overrideTranslations.es[BUNDLED_LOCALE_KEY]).toBeTruthy()
    expect(t(BUNDLED_LOCALE_KEY)).toEqual(overrideTranslations.es[BUNDLED_LOCALE_KEY])
  })

  it("lets a stored override for the locale win over that bundled file", () => {
    applyTranslations("es", { es: { [BUNDLED_LOCALE_KEY]: "Desde la base de datos" } })

    expect(t(BUNDLED_LOCALE_KEY)).toEqual("Desde la base de datos")
  })

  // The English layers stay under the locale ones, so a key with nothing to fall back to still
  // reads the English override.
  it("uses an English override for a key the locale does not translate", () => {
    applyTranslations("es", { en: { [OVERRIDE_ONLY_KEY]: "From the database" } })

    expect(translations.es[OVERRIDE_ONLY_KEY]).toBeUndefined()
    expect(t(OVERRIDE_ONLY_KEY)).toEqual("From the database")
  })

  it("resets between calls rather than accumulating", () => {
    applyTranslations("en", { en: { [OVERRIDE_ONLY_KEY]: "From the database" } })
    applyTranslations("en")

    expect(t(OVERRIDE_ONLY_KEY)).toEqual(BUNDLED_VALUE)
  })
})

// The three states an overridable section can be in, reached through the override layers rather
// than through addTranslation directly.
describe("tIfExists against the layered overrides", () => {
  // Called with tIfExists in the public site and supplied by no bundled layer.
  const UNSUPPLIED_KEY = "test.unsupplied"
  // Called with tIfExists and supplied by the mocked bundled override file.
  const BUNDLED_KEY = "test.bundledLocale"

  beforeEach(() => applyTranslations("en"))

  it("hides a section no layer supplies", () => {
    applyTranslations("en")

    expect(tIfExists(UNSUPPLIED_KEY)).toBeNull()
  })

  it("shows a section a stored override adds", () => {
    applyTranslations("en", { en: { [UNSUPPLIED_KEY]: "Only in the database" } })

    expect(tIfExists(UNSUPPLIED_KEY)).toEqual("Only in the database")
  })

  it("hides a bundled section when a stored override empties it", () => {
    expect(tIfExists(BUNDLED_KEY)).toBeTruthy()

    applyTranslations("en", { en: { [BUNDLED_KEY]: "" } })

    expect(tIfExists(BUNDLED_KEY)).toBeNull()
  })

  it("shows the section again once the override is reverted", () => {
    applyTranslations("en", { en: { [BUNDLED_KEY]: "" } })
    expect(tIfExists(BUNDLED_KEY)).toBeNull()

    // Reverting deletes the row, so the next generation reads no override for the key.
    applyTranslations("en")

    expect(tIfExists(BUNDLED_KEY)).toEqual(overrideTranslations.en[BUNDLED_KEY])
  })
})
